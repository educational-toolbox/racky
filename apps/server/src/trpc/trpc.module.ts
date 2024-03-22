import { TrpcRouter } from '@educational-toolbox/racky-api/trpc/trpc.router';
import { trpcServiceProvider } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Module } from '@nestjs/common';
import { ExampleRouter } from '../example/example.router';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [trpcServiceProvider, TrpcRouter, ExampleRouter],
  exports: [TrpcRouter],
})
export class TrpcModule {}
