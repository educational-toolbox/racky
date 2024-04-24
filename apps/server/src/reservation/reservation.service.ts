import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@educational-toolbox/racky-api/database/database.service';
import { ReservationWrite } from './reservation.schema';

@Injectable()
export class ReservationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(reservation: ReservationWrite, userId: string) {
    return this.databaseService.reservation.create({
      data: {
        ...reservation,
        user: { connect: { id: userId } },
      },
    });
  }
}
