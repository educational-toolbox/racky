import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { TIME } from '~/CONSTANTS';
import { TrpcService } from '~/trpc/trpc.service';
import { openapi } from './user.openapi';
import { UserService } from './user.service';

@Injectable()
export class UserRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UserService,
  ) {}

  router = this.trpc.router({
    whoami: this.trpc.publicProcedure
      .meta({
        openapi: openapi()
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
    getUser: this.trpc.publicProcedure
      .meta({
        openapi: openapi()
          .summary('Get user')
          .segments('get', '{id}')
          .withCache()
          .build(),
        caching: {
          ttl: TIME.ONE_HOUR,
        },
      })
      .input(z.object({ id: z.string() }))
      .output(
        z
          .object({
            id: z.string(),
            email: z.string(),
            firstName: z.string().nullable().default('UNSET'),
            lastName: z.string().nullable().default('UNSET'),
          })
          .nullable(),
      )
      .query(({ input }) => {
        return this.userService.getOne(input.id);
      }),
  });
}
