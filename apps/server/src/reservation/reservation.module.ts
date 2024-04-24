import { DatabaseModule } from '@educational-toolbox/racky-api/database/database.module';
import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationRouter } from './reservation.router';

@Module({
  imports: [DatabaseModule],
  providers: [ReservationService, ReservationRouter],
  exports: [ReservationRouter],
})
export class ReservationModule {}
