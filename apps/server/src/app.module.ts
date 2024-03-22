import { TrpcModule } from '@educational-toolbox/racky-api/trpc/trpc.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { DatabaseModule } from './database/database.module';
import { LogEntryEventController } from './events/log-entry.event.contoller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TrpcModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController, LogEntryEventController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AppModule {}
