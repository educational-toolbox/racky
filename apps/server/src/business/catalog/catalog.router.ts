import { Injectable } from '@nestjs/common';
import { TrpcService } from '~/trpc/trpc.service';
import { z } from 'zod';
import { CatalogService } from './catalog.service';
import { ItemSchemaRead } from '~/business/item/item.schema';
import { CatalogItemSchemaRead } from './catalog.schema';

@Injectable()
export class CatalogRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly catalogService: CatalogService,
  ) {}

  router = this.trpc.router({
    items: this.trpc.assignedToOrgProcedure
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
          ctx.user.orgId,
        );
        return result;
      }),

    catalogueItems: this.trpc.assignedToOrgProcedure
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
      .query(({ ctx }) =>
        this.catalogService.findCatalogueItems(ctx.user.orgId),
      ),
  });
}
