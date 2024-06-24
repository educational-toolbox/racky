import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ReservationRead, ReservationWrite } from './reservation.schema';

@Injectable()
export class ReservationService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.reservation.findMany();
  }

  findOne(reservationId: string) {
    return this.databaseService.reservation.findUnique({
      where: { id: reservationId },
    });
  }

  create(reservation: ReservationWrite, userId: string) {
    return this.databaseService.reservation.create({
      data: {
        ...reservation,
        user: { connect: { id: userId } },
      },
    });
  }

  update(reservation: ReservationRead, userId: string) {
    return this.databaseService.reservation.update({
      where: { id: reservation.id, userId },
      data: reservation,
    });
  }

  delete(reservationId: string) {
    return this.databaseService.reservation.delete({
      where: { id: reservationId },
    });
  }
}
