import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CatalogItemWrite } from './catalog.schema';

@Injectable()
export class CatalogService {
  constructor(private readonly databaseService: DatabaseService) {}

  findCatalogueItems(organizationId: string, categoryId: string) {
    return this.databaseService.catalogueItem.findMany({
      where: {
        organizationId,
        categoryId: categoryId,
      },
    });
  }

  createCatalogue(catalog: CatalogItemWrite) {
    return this.databaseService.catalogueItem.create({
      data: {
        description: catalog.description,
        name: catalog.name,
        quantity: catalog.quantity,
        organizationId: catalog.organizationId,
        categoryId: catalog.categoryId,
      },
    });
  }
}
