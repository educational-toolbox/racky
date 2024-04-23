import { Module } from '@nestjs/common';
import { DatabaseModule } from '@educational-toolbox/racky-api/database/database.module';
import { CatalogService } from '@educational-toolbox/racky-api/catalog/catalog.service';
import { CatalogRouter } from '@educational-toolbox/racky-api/catalog/catalog.router';
import { trpcServiceProvider } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { AuthModule } from '@educational-toolbox/racky-api/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [trpcServiceProvider, CatalogService, CatalogRouter],
  exports: [CatalogRouter],
})
export class CatalogModule {}
