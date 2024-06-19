import { CatalogModule } from '@educational-toolbox/racky-api/catalog/catalog.module';
import { CategoryModule } from '@educational-toolbox/racky-api/category/category.module';
import { ItemModule } from '@educational-toolbox/racky-api/item/item.module';
import { TrpcRouter } from '@educational-toolbox/racky-api/trpc/trpc.router';
import {
  TrpcService,
  trpcServiceProvider,
} from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../media/media.module';
import { OrganizationModule } from '../organization/organization.module';
import { ReservationModule } from '../reservation/reservation.module';

@Global()
@Module({
  imports: [
    AuthModule,

    // Controller-related
    CatalogModule,
    ItemModule,
    CategoryModule,
    ReservationModule,
    MediaModule,
    OrganizationModule,
  ],
  providers: [trpcServiceProvider, TrpcRouter],
  exports: [TrpcRouter, TrpcService],
})
export class TrpcModule {}
