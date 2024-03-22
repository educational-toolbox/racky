import { TrpcModule } from '@educational-toolbox/racky-api/trpc/trpc.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
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
  providers: [AppService],
})
export class AppModule {}
