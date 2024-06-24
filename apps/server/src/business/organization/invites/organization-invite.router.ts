import { subject } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { OrganizationInvite } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { TrpcService } from '../../../trpc/trpc.service';
import { openapi } from '../organization.openapi';
import { OrganizationService } from '../organization.service';

@Injectable()
export class OrganizationInviteRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly organizationService: OrganizationService,
  ) {}
  router = this.trpc.router({
    createInvite: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .method('POST')
          .segments('{id}', 'invite')
          .summary('Invite a user to an organization')
          .protected()
          .build(),
      })
      .input(z.object({ id: z.string(), email: z.string().email() }))
      .output(
        z.object({
          result: z.enum(['success', 'already_invited']),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (
          ctx.user.permissions.organization.cannot(
            'create',
            subject('OrganizationInvite', {
              organizationId: input.id,
            } as OrganizationInvite),
          )
        ) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const exists = await this.organizationService.checkInviteExistence(
          input.email,
        );
        if (exists) {
          return { result: 'already_invited' } as const;
        }
        // TODO: Send invite email
        await this.organizationService.createInvite(input.email, input.id);
        return { result: 'success' } as const;
      }),
    getInvite: this.trpc.publicProcedure
      .meta({
        openapi: openapi()
          .segments('invite', '{id}')
          .summary('Get an organization invite')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(
        z.object({
          organizationName: z.string(),
        }),
      )
      .query(async ({ input }) => {
        const invite = await this.organizationService.checkInviteExistence(
          input.id,
        );
        if (!invite) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        return {
          organizationName: invite.organization.name,
        };
      }),
    acceptInvite: this.trpc.protectedProcedure
      .meta({
        openapi: openapi()
          .method('POST')
          .segments('invite', '{id}', 'accept')
          .summary('Accept an organization invite')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(z.void())
      .mutation(async ({ input, ctx }) => {
        const invite = await this.organizationService.checkInviteExistence(
          input.id,
        );
        if (!invite) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        await this.organizationService.addUser(
          invite.organization.id,
          ctx.user.id,
        );
        await this.organizationService.validateInvite(input.id);
      }),
  });
}
