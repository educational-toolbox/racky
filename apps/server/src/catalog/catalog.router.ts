import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { z } from 'zod';
import { CatalogService } from '@educational-toolbox/racky-api/catalog/catalog.service';

const ItemSchema = z.object({
  id: z.string(),
  pictureOverride: z.string().nullable(),
  status: z.string(),
});

@Injectable()
export class CatalogRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly catalogueService: CatalogService,
  ) {}

  catalogRouter = this.trpc.router({
    items: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'GET', path: '/items' } })
      .input(z.object({ id: z.string() }))
      .output(z.array(ItemSchema))
      .query(({ input }) => this.catalogueService.findItemByCategory(input.id)),
  });
}
