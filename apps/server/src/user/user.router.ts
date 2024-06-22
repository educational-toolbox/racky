import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { TrpcService } from '../trpc/trpc.service';
import { UserService } from './user.service';
import { OpenapiMetaBuilder } from '../trpc/openapi-meta';

const openapi = new OpenapiMetaBuilder('user').tags('User');

@Injectable()
export class UserRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UserService,
  ) {}

  router = this.trpc.router({
    whoami: this.trpc.publicProcedure
      .meta({
        openapi: openapi
          .clone()
          .summary('Get current user session')
          .segments('whoami')
          .build(),
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
    getAnonymous: this.trpc.publicProcedure
      .meta({
        openapi: openapi
          .clone()
          .summary('Get user')
          .segments('get', '{id}')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(z.any())
      .query(({ input }) => {
        return this.userService.getOne(input.id);
      }),
  });
}
