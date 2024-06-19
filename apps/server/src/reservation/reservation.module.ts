import { Module } from '@nestjs/common';
import { ReservationRouter } from './reservation.router';
import { ReservationService } from './reservation.service';

@Module({
  imports: [],
  providers: [ReservationService, ReservationRouter],
  exports: [ReservationRouter],
})
export class ReservationModule {}
