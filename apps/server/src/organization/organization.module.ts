import { Module } from '@nestjs/common';
import { OrganizationRouter } from './organization.router';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationRouter, OrganizationService],
  exports: [OrganizationRouter],
})
export class OrganizationModule {}
