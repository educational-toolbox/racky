import { CatalogRouter } from '@educational-toolbox/racky-api/catalog/catalog.router';
import { CatalogService } from '@educational-toolbox/racky-api/catalog/catalog.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [CatalogService, CatalogRouter],
  exports: [CatalogRouter],
})
export class CatalogModule {}
