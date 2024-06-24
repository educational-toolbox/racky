import { ItemSchemaRead, ItemSchemaWrite } from '~/business/item/item.schema';
import { ItemService } from '~/business/item/item.service';
import { TrpcService } from '~/trpc/trpc.service';
import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { openapi } from './item.openapi';

@Injectable()
export class ItemRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly itemService: ItemService,
  ) {}

  router = this.trpc.router({
    getOne: this.trpc.publicProcedure
      .meta({
        openapi: openapi().segments('{id}').summary('Get an item').build(),
        caching: true,
      })
      .input(z.object({ id: z.string() }))
      .output(ItemSchemaRead.or(z.null()))
      .mutation(async ({ input }) => {
        const item = await this.itemService.getItemById(input.id);
        if (item == null) throw new TRPCError({ code: 'NOT_FOUND' });
        return item;
      }),

    addItem: this.trpc.protectedProcedure
      .meta({
        openapi: openapi().method('POST').summary('Create a new item').build(),
      })
      .input(ItemSchemaWrite)
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.createItem(input)),

    editItem: this.trpc.protectedProcedure
      .meta({
        openapi: openapi()
          .segments('{id}')
          .method('PUT')
          .summary('Update an item')
          .build(),
      })
      .input(ItemSchemaRead)
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.editItem(input)),

    deleteItem: this.trpc.protectedProcedure
      .meta({
        openapi: openapi()
          .method('DELETE')
          .segments('{id}')
          .summary('Delete an item')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.deleteItem(input.id)),
  });
}
