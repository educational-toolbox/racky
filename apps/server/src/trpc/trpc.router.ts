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
import { clerkClient } from '../auth/clerk-client';
import { DatabaseService } from '../database/database.service';
import { MediaRouter } from '../media/media.router';
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
  ) {
    this.openapiDoc = this.generateTRPCOpenAPIDocument();
  }

  appRouter = this.trpc.router({
    catalog: this.catalogRouter.catalogRouter,
    items: this.itemRouter.itemRouter,
    category: this.categoryRouter.categoryRouter,
    reservation: this.reservationRouter.reservationRouter,
    media: this.mediaRouter.mediaRouter,
  });

  private async getClientId(req: Request): Promise<string> {
    // TODO: Make it dependent on AuthProvider instead of hardcoded Clerk instance
    return (
      await clerkClient.verifyToken(
        req.headers['authorization']?.slice(7) as string,
      )
    ).sub;
  }

  private generateUniqueKey(req: Request, clientId: string): string {
    this.logger.log(`Request from client with id "${clientId}"`);
    return `${req.method}:${req.originalUrl}:client-${clientId}`;
  }

  async applyTRPCHandler(app: INestApplication) {
    app.use(
      `/trpc`,
      async (req: Request, res: Response, next: NextFunction) => {
        const clientId = await this.getClientId(req);
        const middleware = trpcExpress.createExpressMiddleware({
          router: this.appRouter,
          createContext: async (info) => {
            return {
              clientId,
              db: this.databaseService,
              req,
              key: this.generateUniqueKey(info.req, clientId),
            };
          },
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
        createContext: async (info) => {
          const clientId = await this.getClientId(info.req);
          return {
            clientId,
            db: this.databaseService,
            req,
            key: this.generateUniqueKey(info.req, clientId),
          };
        },
      });
      if (req.path in this.openapiDoc.paths) {
        return middleware(req, res);
      }
      return next();
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];
