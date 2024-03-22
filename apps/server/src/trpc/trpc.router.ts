import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { NextFunction, Request, Response } from 'express';
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi';
import { DatabaseService } from '../database/database.service';
import { ExampleRouter } from '../example/example.router';
import { env } from '../server-env';

@Injectable()
export class TrpcRouter {
  readonly openapiDoc: ReturnType<typeof generateOpenApiDocument>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly databaseService: DatabaseService,
    private readonly exampleRouter: ExampleRouter,
  ) {
    this.openapiDoc = this.generateTRPCOpenAPIDocument();
  }

  appRouter = this.trpc.mergeRouters(this.exampleRouter.exampleRouter);

  async applyTRPCHandler(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext: () => {
          return { db: this.databaseService };
        },
      }),
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
    const callback = createOpenApiExpressMiddleware({
      router: this.appRouter,
      createContext: () => {
        return { db: this.databaseService };
      },
    });
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path in this.openapiDoc.paths) {
        return callback(req, res);
      }
      return next();
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];
