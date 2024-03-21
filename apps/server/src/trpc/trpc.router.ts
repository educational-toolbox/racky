import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { NextFunction, Request, Response } from 'express';
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi';
import { z } from 'zod';

@Injectable()
export class TrpcRouter {
  readonly openapiDoc: ReturnType<typeof generateOpenApiDocument>;

  constructor(private readonly trpc: TrpcService) {
    this.openapiDoc = this.generateTRPCOpenAPIDocument();
  }

  appRouter = this.trpc.router({
    hello: this.trpc.procedure
      .meta({ /* 👉 */ openapi: { method: 'GET', path: '/say-hello' } })
      .input(z.object({ name: z.string().optional() }))
      .output(z.string())
      .query(async ({ input }) => {
        await new Promise((res) => {
          setTimeout(res, 1000);
        });
        return `Hello ${input.name ? input.name : `Bilbo`}`;
      }),
  });

  async applyTRPCHandler(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({ router: this.appRouter }),
    );
  }

  generateTRPCOpenAPIDocument(): ReturnType<typeof generateOpenApiDocument> {
    return generateOpenApiDocument(this.appRouter, {
      title: 'tRPC OpenAPI',
      version: '1.0.0',
      baseUrl: 'http://localhost:3000',
    });
  }

  async applyOpenAPIMiddleware(app: INestApplication) {
    const callback = createOpenApiExpressMiddleware({
      router: this.appRouter,
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
