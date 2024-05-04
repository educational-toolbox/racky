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
          summary: 'Get all catalog items',
          description: 'Get all catalog items from the database',
        },
      })
      .input(z.object({ id: z.string() }))
      .output(z.array(ItemSchemaRead))
      .query(({ input }) =>
        this.catalogService.findItemByCategory(input.id, '911'),
      ),

    catalogueItems: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'GET', path: '/catalogueItems' } })
      .input(z.void())
      .output(z.array(CatalogItemSchemaRead))
      .query(() => this.catalogService.findCatalogueItems('911')),
  });
}
