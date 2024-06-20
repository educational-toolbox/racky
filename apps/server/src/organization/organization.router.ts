import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Injectable } from '@nestjs/common';
import {
  createOrganizationSchema,
  editOrganizationSchema,
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
      .input(createOrganizationSchema)
      .mutation(({ input }) => {
        return this.organizationService.create(input.name, input.zone);
      }),
    editOrganizationSchema: this.trpc.protectedProcedure
      .input(editOrganizationSchema)
      .mutation(({ input }) => {
        return this.organizationService.edit(input.id, input.name, input.zone);
      }),
  });
}
