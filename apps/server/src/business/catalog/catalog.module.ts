import { CatalogRouter } from './catalog.router';
import { CatalogService } from './catalog.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [CatalogService, CatalogRouter],
  exports: [CatalogRouter],
})
export class CatalogModule {}
