import { TrpcModule } from '@educational-toolbox/racky-api/trpc/trpc.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { LogEntryEventController } from './events/log-entry.event.contoller';
import { CachingModule } from './caching/caching.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TrpcModule,
    AuthModule,
    DatabaseModule,
    CachingModule,
  ],
  controllers: [AppController, LogEntryEventController],
  providers: [AppService],
})
export class AppModule {}
