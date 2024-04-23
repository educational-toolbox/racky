import { TrpcRouter } from '@educational-toolbox/racky-api/trpc/trpc.router';
import { trpcServiceProvider } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Module } from '@nestjs/common';
import { ExampleRouter } from '../example/example.router';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CatalogModule } from '@educational-toolbox/racky-api/catalog/catalog.module';

@Module({
  imports: [DatabaseModule, AuthModule, CatalogModule],
  providers: [trpcServiceProvider, TrpcRouter, ExampleRouter],
  exports: [TrpcRouter],
})
export class TrpcModule {}
