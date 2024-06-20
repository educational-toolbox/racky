import { Injectable, Provider } from '@nestjs/common';
import { OpenApiMeta } from 'trpc-openapi';
import { TRPCError, initTRPC } from '@trpc/server';
import type SuperJSON from 'superjson';
import { DatabaseService } from '../database/database.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import type { Request } from 'express';
import type { AuthUser } from '../auth/auth-user.type';

export type TrpcContext = {
  db: DatabaseService;
  req: Request<any>;
  key: string;
  user: AuthUser | undefined;
};

@Injectable()
export class TrpcService {
  constructor(
    public readonly transformer: SuperJSON,
    public readonly guard: AuthenticatedGuard,
  ) {}

  public readonly trpc = initTRPC
    .meta<OpenApiMeta>()
    .context<TrpcContext>()
    .create({ transformer: this.transformer });
  public readonly procedure = this.trpc.procedure;
  public readonly protectedProcedure = this.trpc.procedure.use(async (ctx) => {
    const canActivate = await this.guard.canActivateFromRequest(ctx.ctx.req);
    if (!canActivate || !ctx.ctx.user) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return ctx.next({ ctx: { ...ctx.ctx, user: ctx.ctx.user! } });
  });
  public readonly adminProcedure = this.protectedProcedure.use(async (ctx) => {
    if (ctx.ctx.user.role !== 'ADMIN') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return ctx.next(ctx);
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
    const instance = new transformer.default({ dedupe: false });
    return new TrpcService(instance, guard);
  },
  inject: [AuthenticatedGuard],
};
