import { Module } from '@nestjs/common';
import { NotificationsRouter } from './notification.router';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  providers: [NotificationService, NotificationsRouter],
  exports: [NotificationService, NotificationsRouter],
})
export class NotificationModule {}
