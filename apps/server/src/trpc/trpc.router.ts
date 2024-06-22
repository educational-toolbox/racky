import { CatalogRouter } from '@educational-toolbox/racky-api/catalog/catalog.router';
import { CategoryRouter } from '@educational-toolbox/racky-api/category/category.router';
import { ItemRouter } from '@educational-toolbox/racky-api/item/item.router';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { INestApplication, Injectable, Logger } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { NextFunction, Request, Response } from 'express';
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi';
import { AuthUserWithPermissions } from '../auth/auth-user.type';
import { clerkClient } from '../auth/clerk-client';
import { getPermissions } from '../auth/permissions';
import { DatabaseService } from '../database/database.service';
import { MediaRouter } from '../media/media.router';
import { OrganizationRouter } from '../organization/organization.router';
import { ReservationRouter } from '../reservation/reservation.router';
import { env } from '../server-env';
import { z } from 'zod';
import { Role } from '@prisma/client';

export type TrpcContext = {
  db: DatabaseService;
  req: Request<any>;
  user: AuthUserWithPermissions | undefined;
};

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
    // I was too lazy to create another router lmao
    auth: this.trpc.router({
      session: this.trpc.publicProcedure
        .meta({
          openapi: {
            method: 'GET',
            path: '/session',
            summary: 'Get the current session',
            tags: ['Auth'],
          },
        })
        .input(z.void())
        .output(
          z
            .object({
              id: z.string(),
              orgId: z.string().nullable(),
              role: z.nativeEnum(Role),
            })
            .nullable(),
        )
        .query(({ ctx }) => {
          return ctx.user ?? null;
        }),
    }),
    // Other routers
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
      return (
        await clerkClient.verifyToken(
          req.headers['authorization']?.slice(7) as string,
        )
      ).sub;
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
