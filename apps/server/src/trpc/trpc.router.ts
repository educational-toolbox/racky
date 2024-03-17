import { INestApplication, Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';

@Injectable()
export class TrpcRouter {
  constructor(private readonly trpc: TrpcService) {}

  appRouter = this.trpc.router({
    hello: this.trpc.procedure
      .input(z.object({ name: z.string().optional() }))
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
}

export type AppRouter = TrpcRouter['appRouter'];
