import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { z } from 'zod';
import { CatalogService } from '@educational-toolbox/racky-api/catalog/catalog.service';
import { CatalogItemSchema } from '@educational-toolbox/racky-api/catalog/catalog.schema';
import { ItemSchema } from '@educational-toolbox/racky-api/item/item.schema';

@Injectable()
export class CatalogRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly catalogService: CatalogService,
  ) {}

  catalogRouter = this.trpc.router({
    items: this.trpc.procedure
      .meta({ openapi: { method: 'GET', path: '/items' } })
      .input(z.object({ id: z.string() }))
      .output(z.array(ItemSchema))
      .query(({ input }) =>
        this.catalogService.findItemByCategory(input.id, '911'),
      ),

    catalogueItems: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'GET', path: '/catalogueItems' } })
      .input(z.void())
      .output(z.array(CatalogItemSchema))
      .query(() => this.catalogService.findCatalogueItems('911')),
  });
}
