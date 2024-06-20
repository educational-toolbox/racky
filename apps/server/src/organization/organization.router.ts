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

@Injectable()
export class OrganizationRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly organizationService: OrganizationService,
  ) {}

  router = this.trpc.router({
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
    editOrganizationSchema: this.trpc.protectedProcedure
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
  });
}
