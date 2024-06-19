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

  router = this.trpc.router({
    findAll: this.trpc.procedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/reservations',
          tags: ['Reservation'],
          summary: 'Get all reservations',
          description: 'Get all reservations from the database',
        },
      })
      .input(z.void())
      .output(z.array(reservationSchemaRead))
      .query(() => this.reservationService.findAll()),

    findOne: this.trpc.procedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/reservation/{id}',
          example: { request: { id: '1' } },
          tags: ['Reservation'],
          summary: 'Get a reservation by id',
          description: 'Get a reservation from the database by id',
        },
      })
      .input(z.object({ id: z.string() }))
      .output(reservationSchemaRead.nullable())
      .query(({ input }) => this.reservationService.findOne(input.id)),

    create: this.trpc.protectedProcedure
      .meta({
        openapi: {
          method: 'POST',
          path: '/reservation',
          tags: ['Reservation'],
          summary: 'Create a reservation',
          description: 'Create a reservation in the database',
        },
      })
      .input(reservationSchemaWrite)
      .output(reservationSchemaRead)
      .mutation(({ input, ctx }) =>
        this.reservationService.create(input, ctx.clientId),
      ),

    update: this.trpc.protectedProcedure
      .meta({
        openapi: {
          method: 'PUT',
          path: '/reservation',
          tags: ['Reservation'],
          summary: 'Update a reservation',
          description: 'Update a reservation in the database by id',
        },
      })
      .input(reservationSchemaRead)
      .output(reservationSchemaRead)
      .mutation(({ input, ctx }) =>
        this.reservationService.update(input, ctx.clientId),
      ),

    delete: this.trpc.protectedProcedure
      .meta({
        openapi: {
          method: 'DELETE',
          path: '/reservation',
          tags: ['Reservation'],
          summary: 'Delete a reservation',
          description: 'Delete a reservation from the database by id',
        },
      })
      .input(z.object({ id: z.string() }))
      .output(reservationSchemaRead)
      .mutation(({ input }) => this.reservationService.delete(input.id)),
  });
}
