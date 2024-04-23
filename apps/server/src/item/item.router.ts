import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { ItemSchema } from '@educational-toolbox/racky-api/catalog/catalog.shema';
import { z } from 'zod';
import { ItemService } from '@educational-toolbox/racky-api/item/item.service';

@Injectable()
export class ItemRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly itemService: ItemService,
  ) {}

  itemRouter = this.trpc.router({
    addItem: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'POST', path: '/item' } })
      .input(ItemSchema)
      .output(ItemSchema)
      .mutation(({ input }) => this.itemService.createItem(input)),

    editItem: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'PUT', path: '/item' } })
      .input(ItemSchema)
      .output(ItemSchema)
      .mutation(({ input }) => this.itemService.editItem(input)),

    deleteItem: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'DELETE', path: '/item' } })
      .input(z.object({ id: z.string() }))
      .output(ItemSchema)
      .mutation(({ input }) => this.itemService.deleteItem(input.id)),
  });
}
