import { TrpcRouter } from '@educational-toolbox/racky-api/trpc/trpc.router';
import {
  TrpcService,
  trpcServiceProvider,
} from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CatalogModule } from '@educational-toolbox/racky-api/catalog/catalog.module';
import { ItemModule } from '@educational-toolbox/racky-api/item/item.module';

@Global()
@Module({
  imports: [DatabaseModule, AuthModule, CatalogModule, ItemModule],
  providers: [trpcServiceProvider, TrpcRouter],
  exports: [TrpcRouter, TrpcService],
})
export class TrpcModule {}
