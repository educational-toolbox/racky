import { subject } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Organization, OrganizationInvite, Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { TrpcService } from '..//trpc/trpc.service';
import { OpenapiMetaBuilder } from '../trpc/openapi-meta.builder';
import {
  createOrganizationSchema,
  editOrganizationSchema,
  organizationSchema,
} from './organization.schema';
import { OrganizationService } from './organization.service';

const openapi = new OpenapiMetaBuilder('organization').tags('Organization');

@Injectable()
export class OrganizationRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly organizationService: OrganizationService,
  ) {}

  router = this.trpc.router({
    list: this.trpc.adminProcedure
      .meta({
        openapi: openapi
          .clone()
          .segments('list')
          .summary('List organizations')
          .protected()
          .withCache()
          .build(),
        caching: true,
      })
      .input(z.void())
      .output(organizationSchema.array())
      .query(() => this.organizationService.getAll()),
    create: this.trpc.adminProcedure
      .meta({
        openapi: openapi
          .clone()
          .summary('Create an organization')
          .protected()
          .build(),
      })
      .input(createOrganizationSchema)
      .output(organizationSchema)
      .mutation(({ input }) => {
        return this.organizationService.create(input.name, input.zone);
      }),
    edit: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi
          .clone()
          .method('PUT')
          .segments('{id}')
          .summary('Edit an organization')
          .protected()
          .build(),
      })
      .input(editOrganizationSchema)
      .output(organizationSchema)
      .mutation(async ({ input, ctx }) => {
        const org = await this.organizationService.get(input.id);
        if (!org) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        const can = ctx.user.permissions.organization.can(
          'update',
          subject('Organization', org),
        );
        if (!can) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return this.organizationService.edit(input.id, input.name, input.zone);
      }),
    delete: this.trpc.adminProcedure
      .meta({
        openapi: openapi
          .method('DELETE')
          .segments('{id}')
          .summary('Delete an organization')
          .protected()
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(z.void())
      .mutation(async ({ input }) => {
        const deleted = await this.organizationService.delete([input.id]);
        if (deleted.count === 0) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
      }),
    getUsers: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi
          .clone()
          .method('GET')
          .segments('{id}', 'users')
          .summary('Get users in an organization')
          .protected()
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(
        z.array(
          z.object({
            id: z.string(),
            email: z.string(),
            firstName: z.string().nullable(),
            lastName: z.string().nullable(),
            role: z.nativeEnum(Role),
          }),
        ),
      )
      .query(async ({ input, ctx }) => {
        if (
          ctx.user.permissions.organization.cannot(
            'read',
            subject('Organization', {
              id: input.id,
            } as Organization),
          )
        ) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return this.organizationService.getUsers(input.id);
      }),
    createInvite: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi
          .clone()
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
        openapi: openapi
          .clone()
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
        openapi: openapi
          .clone()
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
