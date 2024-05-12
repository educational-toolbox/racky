import { Injectable, Provider } from '@nestjs/common';
import { OpenApiMeta } from 'trpc-openapi';
import { TRPCError, initTRPC } from '@trpc/server';
import type SuperJSON from 'superjson';
import { DatabaseService } from '../database/database.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import type { Request } from 'express';

@Injectable()
export class TrpcService {
  constructor(
    public readonly transformer: SuperJSON,
    public readonly guard: AuthenticatedGuard,
  ) {}

  public readonly trpc = initTRPC
    .meta<OpenApiMeta>()
    .context<{ db: DatabaseService; req: Request<any>; key: string }>()
    .create({ transformer: this.transformer });
  public readonly procedure = this.trpc.procedure;
  public readonly protectedProcedure = this.trpc.procedure.use(async (ctx) => {
    const canActivate = await this.guard.canActivateFromRequest(ctx.ctx.req);
    if (!canActivate) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return ctx.next();
  });
  public readonly router = this.trpc.router;
  public readonly mergeRouters = this.trpc.mergeRouters;
}

export const trpcServiceProvider: Provider = {
  provide: TrpcService,
  async useFactory(guard: AuthenticatedGuard) {
    const transformer = await (eval(`import('superjson')`) as Promise<
      typeof import('superjson')
    >);
    const instance = new transformer.default();
    return new TrpcService(instance, guard);
  },
  inject: [AuthenticatedGuard],
};
