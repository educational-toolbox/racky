import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../../trpc/trpc.service';
import { openapi } from './reservation.openapi';
import {
  reservationSchemaRead,
  reservationSchemaWrite,
} from './reservation.schema';
import { ReservationService } from './reservation.service';

@Injectable()
export class ReservationRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly reservationService: ReservationService,
  ) {}

  router = this.trpc.router({
    findAll: this.trpc.publicProcedure
      .meta({
        openapi: openapi().summary('Get all reservations').build(),
      })
      .input(z.void())
      .output(z.array(reservationSchemaRead))
      .query(() => this.reservationService.findAll()),

    findOne: this.trpc.publicProcedure
      .meta({
        openapi: openapi()
          .segments('{id}')
          .summary('Get a reservation by id')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(reservationSchemaRead.nullable())
      .query(({ input }) => this.reservationService.findOne(input.id)),

    findActiveForItem: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .segments('active/{itemId}')
          .summary('Get all active reservations for an item')
          .build(),
      })
      .input(z.object({ itemId: z.string() }))
      .output(
        z.array(reservationSchemaRead.omit({ itemId: true, status: true })),
      )
      .query(({ input, ctx }) =>
        this.reservationService.findActiveForItem(input.itemId, ctx.user.orgId),
      ),

    getMy: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .segments('my')
          .summary('Get all reservations for the current user')
          .build(),
      })
      .input(z.void())
      .output(
        z.array(
          reservationSchemaRead.extend({
            item: z.object({
              id: z.string(),
              name: z.string(),
              picture: z.string().nullable(),
              catalogueItem: z.object({
                id: z.string(),
                name: z.string(),
                category: z.object({ id: z.string(), name: z.string() }),
              }),
            }),
          }),
        ),
      )
      .query(({ ctx }) => this.reservationService.findByUserId(ctx.user.id)),

    cancel: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .method('POST')
          .segments('cancel/{id}')
          .summary('Cancel a reservation')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(reservationSchemaRead)
      .mutation(({ input, ctx }) => {
        return this.reservationService.cancel(input.id, ctx.user.id);
      }),

    create: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .method('POST')
          .summary('Create a reservation')
          .build(),
      })
      .input(reservationSchemaWrite)
      .output(reservationSchemaRead)
      .mutation(({ input, ctx }) =>
        this.reservationService.create(input, ctx.user.id, ctx.user.orgId),
      ),

    update: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .method('PUT')
          .segments('{id}')
          .summary('Update a reservation')
          .build(),
      })
      .input(reservationSchemaRead)
      .output(reservationSchemaRead)
      .mutation(({ input, ctx }) =>
        this.reservationService.update(input, ctx.user.orgId),
      ),

    delete: this.trpc.protectedProcedure
      .meta({
        openapi: openapi()
          .method('DELETE')
          .segments('{id}')
          .summary('Delete a reservation')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(reservationSchemaRead)
      .mutation(({ input }) => this.reservationService.delete(input.id)),
  });
}
