import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { ReservationService } from './reservation.service';
import {
  reservationSchemaRead,
  reservationSchemaWrite,
} from './reservation.schema';
import { z } from 'zod';

@Injectable()
export class ReservationRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly reservationService: ReservationService,
  ) {}

  reservationRouter = this.trpc.router({
    findAll: this.trpc.procedure
      .meta({ openapi: { method: 'GET', path: '/reservation' } })
      .output(reservationSchemaRead.array())
      .query(() => this.reservationService.findAll()),

    findOne: this.trpc.procedure
      .meta({ openapi: { method: 'GET', path: '/reservation/:id' } })
      .input(z.object({ id: z.string() }))
      .output(reservationSchemaRead.nullable())
      .query(({ input }) => this.reservationService.findOne(input.id)),

    create: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'POST', path: '/reservation' } })
      .input(reservationSchemaWrite)
      .output(reservationSchemaRead)
      .mutation(({ input }) => this.reservationService.create(input, '911')),

    update: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'PUT', path: '/reservation' } })
      .input(reservationSchemaRead)
      .output(reservationSchemaRead)
      .mutation(({ input }) => this.reservationService.update(input, '911')),

    delete: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'DELETE', path: '/reservation/:id' } })
      .input(z.object({ id: z.string() }))
      .output(reservationSchemaRead)
      .mutation(({ input }) => this.reservationService.delete(input.id)),
  });
}
