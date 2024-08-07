import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ItemRead, ItemWrite } from './item.schema';

@Injectable()
export class ItemService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getItemById(itemId: string) {
    return await this.databaseService.item.findUnique({
      where: { id: itemId },
    });
  }

  async getItemsByCategory(catalogId: string) {
    return await this.databaseService.item.findMany({
      where: { itemCatalogId: catalogId },
    });
  }

  async createItem(item: ItemWrite) {
    return await this.databaseService.item.create({
      data: {
        status: item.status,
        available: true,
        name: item.name,
        picture: item.picture,
        itemCatalogId: item.itemCatalogId,
      },
    });
  }

  async editItem(item: ItemRead) {
    return await this.databaseService.item.update({
      where: { id: item.id },
      data: item,
    });
  }

  async deleteItem(itemId: string) {
    return await this.databaseService.item.delete({ where: { id: itemId } });
  }
}
