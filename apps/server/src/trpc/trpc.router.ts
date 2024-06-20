import { CatalogRouter } from '@educational-toolbox/racky-api/catalog/catalog.router';
import { CategoryRouter } from '@educational-toolbox/racky-api/category/category.router';
import { ItemRouter } from '@educational-toolbox/racky-api/item/item.router';
import {
  TrpcService,
  type TrpcContext,
} from '@educational-toolbox/racky-api/trpc/trpc.service';
import { INestApplication, Injectable, Logger } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { NextFunction, Request, Response } from 'express';
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi';
import { AuthUser } from '../auth/auth-user.type';
import { clerkClient } from '../auth/clerk-client';
import { DatabaseService } from '../database/database.service';
import { MediaRouter } from '../media/media.router';
import { OrganizationRouter } from '../organization/organization.router';
import { ReservationRouter } from '../reservation/reservation.router';
import { env } from '../server-env';

@Injectable()
export class TrpcRouter {
  private readonly logger = new Logger(TrpcRouter.name);
  readonly openapiDoc: ReturnType<typeof generateOpenApiDocument>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly databaseService: DatabaseService,
    private readonly catalogRouter: CatalogRouter,
    private readonly itemRouter: ItemRouter,
    private readonly categoryRouter: CategoryRouter,
    private readonly reservationRouter: ReservationRouter,
    private readonly mediaRouter: MediaRouter,
    private readonly organizationRouter: OrganizationRouter,
  ) {
    this.openapiDoc = this.generateTRPCOpenAPIDocument();
  }

  appRouter = this.trpc.router({
    catalog: this.catalogRouter.router,
    items: this.itemRouter.router,
    category: this.categoryRouter.router,
    reservation: this.reservationRouter.router,
    media: this.mediaRouter.router,
    org: this.organizationRouter.router,
  });

  private async getUserId(req: Request): Promise<string> {
    // TODO: Make it dependent on AuthProvider instead of hardcoded Clerk instance
    return (
      await clerkClient.verifyToken(
        req.headers['authorization']?.slice(7) as string,
      )
    ).sub;
  }

  private async getUser(userId: string): Promise<AuthUser | undefined> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user) return undefined;
    return {
      id: user.id,
      orgId: user.organizationId,
      role: user.role,
    };
  }

  private generateUniqueKey(req: Request, userId: string): string {
    this.logger.log(`Request from client with id "${userId}"`);
    return `${req.method}:${req.originalUrl}:user-${userId}`;
  }

  private async createContext(req: Request): Promise<TrpcContext> {
    const userId = await this.getUserId(req);
    const user = await this.getUser(userId);
    return {
      user,
      db: this.databaseService,
      req,
      key: this.generateUniqueKey(req, userId),
    };
  }

  async applyTRPCHandler(app: INestApplication) {
    app.use(
      `/trpc`,
      async (req: Request, res: Response, next: NextFunction) => {
        const middleware = trpcExpress.createExpressMiddleware({
          router: this.appRouter,
          createContext: (info) => this.createContext(info.req),
        });
        return middleware(req, res, next);
      },
    );
  }

  generateTRPCOpenAPIDocument(): ReturnType<typeof generateOpenApiDocument> {
    return generateOpenApiDocument(this.appRouter, {
      title: 'tRPC OpenAPI',
      version: '1.0.0',
      baseUrl: env.NEXT_PUBLIC_NESTJS_SERVER,
    });
  }

  async applyOpenAPIMiddleware(app: INestApplication) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const middleware = createOpenApiExpressMiddleware({
        router: this.appRouter,
        createContext: (info) => this.createContext(info.req),
      });
      if (req.path in this.openapiDoc.paths) {
        return middleware(req, res);
      }
      return next();
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];
