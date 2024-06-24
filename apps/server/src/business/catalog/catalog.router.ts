import { Injectable } from '@nestjs/common';
import { TrpcService } from '../../trpc/trpc.service';
import { z } from 'zod';
import { CatalogService } from './catalog.service';
import { ItemSchemaRead } from '../../business/item/item.schema';
import { CatalogItemSchemaRead } from './catalog.schema';
import { openapi } from './catalog.openapi';

@Injectable()
export class CatalogRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly catalogService: CatalogService,
  ) {}

  router = this.trpc.router({
    items: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .segments('{categoryId}')
          .summary('Get all items')
          .build(),
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
        openapi: openapi()
          .segments('items')
          .summary('Get all catalogue items')
          .build(),
      })
      .input(z.void())
      .output(z.array(CatalogItemSchemaRead))
      .query(({ ctx }) =>
        this.catalogService.findCatalogueItems(ctx.user.orgId),
      ),
  });
}
