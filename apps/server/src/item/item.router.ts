import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { z } from 'zod';
import { ItemService } from '@educational-toolbox/racky-api/item/item.service';
import {
  ItemSchemaRead,
  ItemSchemaWrite,
} from '@educational-toolbox/racky-api/item/item.schema';
import { CachingService } from '../caching/caching.service';

@Injectable()
export class ItemRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly itemService: ItemService,
    private readonly cacheService: CachingService,
  ) {}

  itemRouter = this.trpc.router({
    getOne: this.trpc.procedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/item',
          tags: ['Item'],
          summary: 'Get an item',
          description: 'Get an item from the database by id',
        },
      })
      .input(z.object({ id: z.string() }))
      .output(ItemSchemaRead.or(z.null()))
      .mutation(async ({ input, ctx: { key } }) => {
        const cachedItem = await this.cacheService.get(key);
        if (cachedItem != null) return ItemSchemaRead.parse(cachedItem);
        const item = await this.itemService.getItemById(input.id);
        await this.cacheService.set(key, item);
        return item;
      }),

    addItem: this.trpc.protectedProcedure
      .meta({
        openapi: {
          method: 'POST',
          path: '/item',
          tags: ['Item'],
          summary: 'Create a new item',
          description: 'Create a new item in the database',
        },
      })
      .input(ItemSchemaWrite)
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.createItem(input)),

    editItem: this.trpc.protectedProcedure
      .meta({
        openapi: {
          method: 'PUT',
          path: '/item',
          tags: ['Item'],
          summary: 'Update an item',
          description: 'Update an item in the database by id',
        },
      })
      .input(ItemSchemaRead)
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.editItem(input)),

    deleteItem: this.trpc.protectedProcedure
      .meta({
        openapi: {
          method: 'DELETE',
          path: '/item',
          tags: ['Item'],
          summary: 'Delete an item',
          description: 'Delete an item in the database by id',
        },
      })
      .input(z.object({ id: z.string() }))
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.deleteItem(input.id)),
  });
}
