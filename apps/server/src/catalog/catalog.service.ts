import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@educational-toolbox/racky-api/database/database.service';

@Injectable()
export class CatalogService {
  constructor(private readonly databaseService: DatabaseService) {}

  findItemByCategory(categoryId: string) {
    return this.databaseService.item.findMany({
      where: {
        itemCatalog: {
          categories: {
            some: {
              clientId: '911',
              id: categoryId,
            },
          },
        },
      },
    });
  }
}
