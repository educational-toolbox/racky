import { Module } from '@nestjs/common';
import { OrganizationRouter } from './organization.router';

@Module({
  providers: [OrganizationRouter],
  exports: [OrganizationRouter],
})
export class OrganizationModule {}
