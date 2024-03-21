import { TrpcModule } from '@educational-toolbox/racky-api/trpc/trpc.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(), TrpcModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
