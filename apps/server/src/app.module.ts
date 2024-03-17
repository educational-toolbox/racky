import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from '@educational-toolbox/racky-api/trpc/trpc.module';

@Module({
  imports: [ConfigModule.forRoot(), TrpcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
