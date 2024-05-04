import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { NextFunction, Request, Response } from 'express';
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi';
import { DatabaseService } from '../database/database.service';
import { env } from '../server-env';
import { CatalogRouter } from '@educational-toolbox/racky-api/catalog/catalog.router';
import { ItemRouter } from '@educational-toolbox/racky-api/item/item.router';
import { CategoryRouter } from '@educational-toolbox/racky-api/category/category.router';

@Injectable()
export class TrpcRouter {
  readonly openapiDoc: ReturnType<typeof generateOpenApiDocument>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly databaseService: DatabaseService,
    private readonly catalogRouter: CatalogRouter,
    private readonly itemRouter: ItemRouter,
    private readonly categoryRouter: CategoryRouter,
  ) {
    this.openapiDoc = this.generateTRPCOpenAPIDocument();
  }

  appRouter = this.trpc.router({
    catalog: this.catalogRouter.catalogRouter,
    items: this.itemRouter.itemRouter,
    category: this.categoryRouter.categoryRouter,
  });

  async applyTRPCHandler(app: INestApplication) {
    app.use(
      `/trpc`,
      async (req: Request, res: Response, next: NextFunction) => {
        const middleware = trpcExpress.createExpressMiddleware({
          router: this.appRouter,
          createContext: () => {
            return { db: this.databaseService, req };
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
        createContext: () => {
          return { db: this.databaseService, req };
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
