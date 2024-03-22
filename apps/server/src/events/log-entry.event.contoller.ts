import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LogEntryEvent } from './log-entry.event';
import { DatabaseService } from '../database/database.service';

@Controller()
export class LogEntryEventController {
  constructor(private readonly database: DatabaseService) {}
  @OnEvent(LogEntryEvent.eventName)
  onNewLogEntry(event: LogEntryEvent) {
    return this.database.log.create({
      data: { text: event.text ?? 'default-log-data', type: event.type },
    });
  }
}
