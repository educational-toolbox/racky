import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../../trpc/trpc.service';
import { openapi } from './catalog.openapi';
import { CatalogItemSchemaRead } from './catalog.schema';
import { CatalogService } from './catalog.service';

@Injectable()
export class CatalogRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly catalogService: CatalogService,
  ) {}

  router = this.trpc.router({
    catalogueItems: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .segments('{categoryId}')
          .summary('Get all catalogue items')
          .build(),
      })
      .input(z.object({ categoryId: z.string() }))
      .output(z.array(CatalogItemSchemaRead))
      .query(({ ctx, input }) =>
        this.catalogService.findCatalogueItems(
          ctx.user.orgId,
          input.categoryId,
        ),
      ),
  });
}
