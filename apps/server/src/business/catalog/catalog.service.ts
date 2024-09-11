import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CatalogItemWrite } from './catalog.schema';

@Injectable()
export class CatalogService {
  constructor(private readonly databaseService: DatabaseService) {}

  findCatalogueItems(organizationId: string, categoryId: string) {
    return this.databaseService.catalogItem.findMany({
      where: {
        organizationId,
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
    });
  }

  createCatalogue(catalog: CatalogItemWrite) {
    return this.databaseService.catalogItem.create({
      data: catalog,
    });
  }
}
