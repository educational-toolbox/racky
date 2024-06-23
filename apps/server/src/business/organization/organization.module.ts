import { Module } from '@nestjs/common';
import { OrganizationInviteRouter } from './invites/organization-invite.router';
import { OrganizationRouter } from './organization.router';
import { OrganizationService } from './organization.service';

@Module({
  providers: [
    OrganizationService,
    OrganizationInviteRouter,
    OrganizationRouter,
  ],
  exports: [OrganizationRouter],
})
export class OrganizationModule {}
