import { INestApplication, Injectable, Logger } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { NextFunction, Request, Response } from 'express';
import type { OpenApiMethod } from 'trpc-openapi';
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi';
import { AuthUserWithPermissions } from '../auth/auth-user.type';
import { clerkClient } from '../auth/clerk-client';
import { getPermissions } from '../auth/permissions';
import { CatalogRouter } from '../catalog/catalog.router';
import { CategoryRouter } from '../category/category.router';
import { DatabaseService } from '../database/database.service';
import { ItemRouter } from '../item/item.router';
import { MediaRouter } from '../media/media.router';
import { OrganizationRouter } from '../organization/organization.router';
import { ReservationRouter } from '../reservation/reservation.router';
import { env } from '../server-env';
import { TrpcService } from '../trpc/trpc.service';
import { UserRouter } from '../user/user.router';

export interface TrpcContext {
  db: DatabaseService;
  req: Request;
  user: AuthUserWithPermissions | undefined;
}

interface OpenapiPath {
  method: OpenApiMethod;
  segments: string[];
}

@Injectable()
export class TrpcRouter {
  private readonly logger = new Logger(TrpcRouter.name);
  readonly openapiDoc: ReturnType<typeof generateOpenApiDocument>;
  private readonly openapiDefinedPaths: OpenapiPath[] = [];

  constructor(
    private readonly trpc: TrpcService,
    private readonly databaseService: DatabaseService,
    private readonly catalogRouter: CatalogRouter,
    private readonly itemRouter: ItemRouter,
    private readonly categoryRouter: CategoryRouter,
    private readonly reservationRouter: ReservationRouter,
    private readonly mediaRouter: MediaRouter,
    private readonly organizationRouter: OrganizationRouter,
    private readonly userRouter: UserRouter,
  ) {
    this.openapiDoc = this.generateTRPCOpenAPIDocument();
    this.openapiDefinedPaths = [];
    for (const path in this.openapiDoc.paths) {
      const meta = this.openapiDoc.paths[path];
      if (!meta) continue;
      const pathSegments = path.split('/').slice(1);
      if (meta.get) {
        this.openapiDefinedPaths.push({
          method: 'GET',
          segments: pathSegments,
        });
      }
      if (meta.post) {
        this.openapiDefinedPaths.push({
          method: 'POST',
          segments: pathSegments,
        });
      }
      if (meta.put) {
        this.openapiDefinedPaths.push({
          method: 'PUT',
          segments: pathSegments,
        });
      }
      if (meta.delete) {
        this.openapiDefinedPaths.push({
          method: 'DELETE',
          segments: pathSegments,
        });
      }
      if (meta.patch) {
        this.openapiDefinedPaths.push({
          method: 'PATCH',
          segments: pathSegments,
        });
      }
    }
  }

  appRouter = this.trpc.router({
    user: this.userRouter.router,
    catalog: this.catalogRouter.router,
    items: this.itemRouter.router,
    category: this.categoryRouter.router,
    reservation: this.reservationRouter.router,
    media: this.mediaRouter.router,
    org: this.organizationRouter.router,
  });

  private async getUserId(req: Request): Promise<string | undefined> {
    // TODO: Make it dependent on AuthProvider instead of hardcoded Clerk instance
    try {
      const token = req.headers.authorization?.slice(7);
      if (!token) return undefined;
      return (await clerkClient.verifyToken(token)).sub;
    } catch (error) {
      return undefined;
    }
  }

  private async getUser(
    userId: string | undefined,
  ): Promise<AuthUserWithPermissions | undefined> {
    if (!userId) return undefined;
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user) return undefined;
    const authUser = {
      id: user.id,
      orgId: user.organizationId,
      role: user.role,
    };
    return { ...authUser, permissions: getPermissions(authUser) };
  }

  private async createContext(req: Request): Promise<TrpcContext> {
    const userId = await this.getUserId(req);
    const user = await this.getUser(userId);
    return {
      user,
      db: this.databaseService,
      req,
    };
  }

  applyTRPCHandler(app: INestApplication) {
    app.use(`/trpc`, (req: Request, res: Response, next: NextFunction) => {
      const middleware = trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext: (info) => this.createContext(info.req),
      });
      return middleware(req, res, next);
    });
  }

  generateTRPCOpenAPIDocument(): ReturnType<typeof generateOpenApiDocument> {
    return generateOpenApiDocument(this.appRouter, {
      title: 'tRPC OpenAPI',
      version: '1.0.0',
      baseUrl: env.NEXT_PUBLIC_NESTJS_SERVER,
    });
  }

  applyOpenAPIMiddleware(app: INestApplication) {
    const allowedMethods: OpenApiMethod[] = [
      'DELETE',
      'GET',
      'PATCH',
      'POST',
      'PUT',
    ];
    app.use((req: Request, res: Response, next: NextFunction) => {
      const segments = req.path.split('/').slice(1);
      if (!allowedMethods.includes(req.method as OpenApiMethod)) {
        return next();
      }
      const matching = this.openapiDefinitionHasMatchingPath(
        segments,
        req.method as OpenApiMethod,
      );
      if (!matching) {
        return next();
      }
      const middleware = createOpenApiExpressMiddleware({
        router: this.appRouter,
        createContext: (info) => this.createContext(info.req),
      });
      return middleware(req, res);
    });
  }

  private openapiDefinitionHasMatchingPath(
    pathSegments: string[],
    method: OpenApiMethod,
  ): boolean {
    for (const definedPath of this.openapiDefinedPaths) {
      if (definedPath.method !== method) continue;
      if (definedPath.segments.length !== pathSegments.length) continue;
      let match = true;
      for (let i = 0; i < definedPath.segments.length; i++) {
        const requestSegment = pathSegments[i];
        const definedSegment = definedPath.segments[i];
        const isParam = definedSegment.startsWith('{');
        if (isParam) continue;
        if (definedSegment === undefined || requestSegment === undefined) {
          continue;
        }
        if (requestSegment !== definedSegment) {
          match = false;
          break;
        }
      }
      return match;
    }
    return false;
  }
}

export type AppRouter = TrpcRouter['appRouter'];
