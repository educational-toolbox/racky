import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { ReservationService } from './reservation.service';
import {
  reservationSchemaRead,
  reservationSchemaWrite,
} from './reservation.schema';

@Injectable()
export class ReservationRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly reservationService: ReservationService,
  ) {}

  reservationRouter = this.trpc.router({
    create: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'POST', path: '/reservation' } })
      .input(reservationSchemaWrite)
      .output(reservationSchemaRead)
      .mutation(({ input }) => this.reservationService.create(input, '911')),
  });
}
