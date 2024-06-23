import { Global, Module } from '@nestjs/common';
import { AuthModule } from '~/auth/auth.module';
import { CatalogModule } from '~/business/catalog/catalog.module';
import { CategoryModule } from '~/business/category/category.module';
import { ItemModule } from '~/business/item/item.module';
import { MediaModule } from '~/business/media/media.module';
import { OrganizationModule } from '~/business/organization/organization.module';
import { ReservationModule } from '~/business/reservation/reservation.module';
import { UsersModule } from '~/business/user/user.module';
import { TrpcService, trpcServiceProvider } from '~/trpc/trpc.service';
import { TrpcRouter } from '~/trpc/trpc.router';

@Global()
@Module({
  imports: [
    AuthModule,
    UsersModule,
    CatalogModule,
    ItemModule,
    CategoryModule,
    ReservationModule,
    MediaModule,
    OrganizationModule,
  ],
  providers: [trpcServiceProvider, TrpcRouter],
  exports: [TrpcService, TrpcRouter],
})
export class TrpcModule {}
