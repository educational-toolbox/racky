import { TrpcRouter } from '@educational-toolbox/racky-api/trpc/trpc.router';
import { trpcServiceProvider } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [trpcServiceProvider, TrpcRouter],
  exports: [TrpcRouter],
})
export class TrpcModule {}
