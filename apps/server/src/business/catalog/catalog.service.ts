import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class CatalogService {
  constructor(private readonly databaseService: DatabaseService) {}

  findItemByCategory(categoryId: string, organizationId: string) {
    return this.databaseService.item.findMany({
      where: {
        itemCatalog: {
          categories: {
            some: {
              organizationId: organizationId,
              id: categoryId,
            },
          },
        },
      },
    });
  }

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
}
