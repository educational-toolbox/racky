import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { z } from 'zod';
import { CatalogService } from '@educational-toolbox/racky-api/catalog/catalog.service';
import { ItemSchemaRead } from '@educational-toolbox/racky-api/item/item.schema';
import { CatalogItemSchemaRead } from '@educational-toolbox/racky-api/catalog/catalog.schema';

@Injectable()
export class CatalogRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly catalogService: CatalogService,
  ) {}

  catalogRouter = this.trpc.router({
    items: this.trpc.procedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/items',
          summary: 'Get all items for a category',
          description: 'Get all items for a category from the database',
          tags: ['Catalog'],
        },
      })
      .input(z.object({ categoryId: z.string() }))
      .output(z.array(ItemSchemaRead))
      .query(async ({ input, ctx }) => {
        const result = await this.catalogService.findItemByCategory(
          input.categoryId,
          ctx.clientId ?? '911',
        );
        return result;
      }),

    catalogueItems: this.trpc.protectedProcedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/catalog/items',
          tags: ['Catalog'],
          summary: 'Get all catalogue items',
          description: 'Get all catalogue items from the database',
        },
      })
      .input(z.void())
      .output(z.array(CatalogItemSchemaRead))
      .query(({ ctx }) => this.catalogService.findCatalogueItems(ctx.clientId)),
  });
}
