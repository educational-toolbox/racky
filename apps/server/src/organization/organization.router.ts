import { subject } from '@casl/ability';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import {
  createOrganizationSchema,
  editOrganizationSchema,
  organizationSchema,
} from './organization.schema';
import { OrganizationService } from './organization.service';
import { z } from 'zod';

@Injectable()
export class OrganizationRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly organizationService: OrganizationService,
  ) {}

  router = this.trpc.router({
    list: this.trpc.adminProcedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/org/list',
          summary: 'List organizations',
          enabled: false,
          protect: true,
        },
        caching: true,
      })
      .input(z.void())
      .output(organizationSchema.array())
      .query(() => {
        return this.organizationService.getAll();
      }),
    create: this.trpc.adminProcedure
      .meta({
        openapi: {
          method: 'POST',
          path: '/org',
          summary: 'Create an organization',
          protect: true,
          enabled: false,
          tags: ['Organization'],
        },
      })
      .input(createOrganizationSchema)
      .output(organizationSchema)
      .mutation(({ input }) => {
        return this.organizationService.create(input.name, input.zone);
      }),
    edit: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: {
          method: 'PUT',
          path: '/org/{id}',
          summary: 'Edit an organization',
          protect: true,
          tags: ['Organization'],
        },
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
        openapi: {
          method: 'DELETE',
          path: '/org/{id}',
          summary: 'Delete an organization',
          protect: true,
          tags: ['Organization'],
        },
      })
      .input(z.object({ id: z.string() }))
      .output(z.void())
      .mutation(async ({ input }) => {
        const deleted = await this.organizationService.delete([input.id]);
        if (deleted.count === 0) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
      }),
  });
}
