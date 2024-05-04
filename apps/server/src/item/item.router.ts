import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { z } from 'zod';
import { ItemService } from '@educational-toolbox/racky-api/item/item.service';
import {
  ItemSchemaRead,
  ItemSchemaWrite,
} from '@educational-toolbox/racky-api/item/item.schema';

@Injectable()
export class ItemRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly itemService: ItemService,
  ) {}

  itemRouter = this.trpc.router({
    addItem: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'POST', path: '/item' } })
      .input(ItemSchemaWrite)
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.createItem(input)),

    editItem: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'PUT', path: '/item' } })
      .input(ItemSchemaRead)
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.editItem(input)),

    deleteItem: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'DELETE', path: '/item' } })
      .input(z.object({ id: z.string() }))
      .output(ItemSchemaRead)
      .mutation(({ input }) => this.itemService.deleteItem(input.id)),
  });
}
