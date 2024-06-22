import { Injectable, Provider } from '@nestjs/common';
import { TRPCError, initTRPC } from '@trpc/server';
import type SuperJSON from 'superjson';
import { OpenApiMeta } from 'trpc-openapi';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { CachingService } from '../caching/caching.service';
import { TrpcContext } from './trpc.router';

export type TrpcMeta = OpenApiMeta & {
  caching?: true | { ttl?: number; common?: true };
};

@Injectable()
export class TrpcService {
  constructor(
    public readonly transformer: SuperJSON,
    public readonly guard: AuthenticatedGuard,
    public readonly cache: CachingService,
  ) {}

  public readonly trpc = initTRPC
    .meta<TrpcMeta>()
    .context<TrpcContext>()
    .create({ transformer: this.transformer });

  public readonly publicProcedure = this.trpc.procedure.use(async (request) => {
    const caching = request.meta?.caching;
    if (request.type === 'query' && caching !== undefined) {
      const key = this.getCacheKey(request, caching !== true && caching.common);
      const cached = await this.cache.get(key);
      if (cached) {
        return {
          data: cached,
          error: null,
          marker: 'middlewareMarker' as 'middlewareMarker' & {
            __brand: 'middlewareMarker';
          },
          ok: true as const,
        };
      }
      const nextRequest = this.requestWithAddedMetaTags(
        request,
        'CACHE-ENABLED',
      );
      const nextResult = await request.next(nextRequest);
      const data = 'data' in nextResult ? nextResult.data : undefined;
      if (data) {
        await this.cache.set(
          key,
          data,
          caching !== true ? caching.ttl : undefined,
        );
      }
      return nextResult;
    }
    return request.next(request);
  });

  public readonly protectedProcedure = this.publicProcedure.use(
    async (request) => {
      const canActivate = await this.guard.canActivateFromRequest(
        request.ctx.req,
      );
      if (!canActivate || !request.ctx.user) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      return request.next({ ctx: { ...request.ctx, user: request.ctx.user } });
    },
  );

  public readonly assignedToOrgProcedure = this.protectedProcedure.use(
    async (request) => {
      if (!request.ctx.user || request.ctx.user.orgId == null) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      return request.next({
        ctx: {
          ...request.ctx,
          user: {
            ...request.ctx.user,
            orgId: request.ctx.user.orgId,
          },
        },
      });
    },
  );

  public readonly adminProcedure = this.protectedProcedure.use(
    async (request) => {
      if (request.ctx.user.role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      const nextRequest = this.requestWithAddedMetaTags(request, 'ADMIN-ONLY');
      return request.next(nextRequest);
    },
  );

  public readonly router = this.trpc.router;
  public readonly mergeRouters = this.trpc.mergeRouters;

  private getCacheKey(
    request: Omit<
      Parameters<Parameters<typeof this.trpc.middleware>['0']>['0'],
      'next'
    >,
    common = false,
  ): string {
    const parts = [
      `trpc:${request.type}:${request.path}`,
      `query:${JSON.stringify(request.input)}`,
    ];
    if (!common) {
      parts.push(`user:${request.ctx.user?.id ?? 'anonymous'}`);
    }
    return parts.join('|');
  }

  private requestWithAddedMetaTags(
    request: Omit<
      Parameters<Parameters<typeof this.trpc.middleware>['0']>['0'],
      'next'
    >,
    ...tags: [string, ...string[]]
  ): Omit<
    Parameters<Parameters<typeof this.trpc.middleware>['0']>['0'],
    'next'
  > {
    const oldMeta = request.meta;
    const newMeta: TrpcMeta | undefined = { ...oldMeta };
    if (oldMeta?.openapi != null) {
      newMeta.openapi = {
        ...oldMeta.openapi,
        tags: [...(oldMeta.openapi.tags ?? []), ...tags],
      };
    }
    const nextRequest: typeof request = {
      ...request,
      meta: newMeta,
    };
    return nextRequest;
  }
}

export const trpcServiceProvider: Provider = {
  provide: TrpcService,
  async useFactory(guard: AuthenticatedGuard, cache: CachingService) {
    const transformer = await (eval(`import('superjson')`) as Promise<{
      default: new (data: { dedupe: boolean }) => SuperJSON;
    }>);
    const instance = new transformer.default({ dedupe: false });
    return new TrpcService(instance, guard, cache);
  },
  inject: [AuthenticatedGuard, CachingService],
};
