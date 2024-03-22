import { Injectable, Provider } from '@nestjs/common';
import { OpenApiMeta } from 'trpc-openapi';
import { initTRPC } from '@trpc/server';
import type SuperJSON from 'superjson';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TrpcService {
  constructor(
    private readonly transformer: SuperJSON,
    private readonly db: DatabaseService,
  ) {}

  public readonly trpc = initTRPC
    .meta<OpenApiMeta>()
    .context<{ db: DatabaseService }>()
    .create({ transformer: this.transformer });
  public readonly procedure = this.trpc.procedure;
  public readonly router = this.trpc.router;
  public readonly mergeRouters = this.trpc.mergeRouters;
}

export const trpcServiceProvider: Provider = {
  provide: TrpcService,
  async useFactory(dbProvider: DatabaseService) {
    const transformer = await (eval(`import('superjson')`) as Promise<
      typeof import('superjson')
    >);
    const instance = new transformer.default();
    return new TrpcService(instance, dbProvider);
  },
  inject: [DatabaseService],
};
