import { Module } from '@nestjs/common';
import { ReservationRouter } from './reservation.router';
import { ReservationService } from './reservation.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [ReservationService, ReservationRouter],
  exports: [ReservationRouter],
})
export class ReservationModule {}
