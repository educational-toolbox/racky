import { CatalogModule } from '../catalog/catalog.module';
import { CategoryModule } from '../category/category.module';
import { ItemModule } from '../item/item.module';
import { TrpcRouter } from './trpc.router';
import { TrpcService, trpcServiceProvider } from './trpc.service';
import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../media/media.module';
import { OrganizationModule } from '../organization/organization.module';
import { ReservationModule } from '../reservation/reservation.module';
import { UsersModule } from '../user/user.module';

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
  exports: [TrpcRouter, TrpcService],
})
export class TrpcModule {}
