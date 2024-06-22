import { subject } from '@casl/ability';
import { Injectable } from '@nestjs/common';
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
  });
}
