import { CatalogRouter } from '@educational-toolbox/racky-api/catalog/catalog.router';
import { CatalogService } from '@educational-toolbox/racky-api/catalog/catalog.service';
import { DatabaseModule } from '@educational-toolbox/racky-api/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  providers: [CatalogService, CatalogRouter],
  exports: [CatalogRouter],
})
export class CatalogModule {}
