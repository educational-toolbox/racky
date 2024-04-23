import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@educational-toolbox/racky-api/database/database.service';

@Injectable()
export class CatalogService {
  constructor(private readonly databaseService: DatabaseService) {}

  findItemByCategory(categoryId: string, clientId: string) {
    return this.databaseService.item.findMany({
      where: {
        itemCatalog: {
          categories: {
            some: {
              clientId: clientId,
              id: categoryId,
            },
          },
        },
      },
    });
  }

  findCatalogueItems(clientId: string) {
    return this.databaseService.catalogItem.findMany({
      where: {
        clientId: clientId,
      },
    });
  }
}
