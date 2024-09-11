import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ItemRead, ItemWrite } from './item.schema';

@Injectable()
export class ItemService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getItemById(itemId: string): Promise<ItemRead | null> {
    return await this.databaseService.item.findUnique({
      where: { id: itemId },
      include: { itemCatalog: { select: { name: true, id: true } } },
    });
  }

  async getItems(
    orgId: string,
    categoryId?: string,
    catalogId?: string,
    name?: string,
  ): Promise<ItemRead[]> {
    return await this.databaseService.item.findMany({
      where: {
        name: { contains: name },
        itemCatalog: { organizationId: orgId },
        OR: [
          { itemCatalogId: catalogId },
          { itemCatalog: { categories: { some: { id: categoryId } } } },
        ],
      },
      include: { itemCatalog: { select: { name: true, id: true } } },
    });
  }

  async createItem(item: ItemWrite): Promise<ItemRead> {
    return await this.databaseService.item.create({
      data: {
        status: item.status,
        available: true,
        name: item.name,
        picture: item.picture,
        itemCatalogId: item.itemCatalogId,
      },
      include: { itemCatalog: { select: { name: true, id: true } } },
    });
  }

  async editItem(item: ItemWrite): Promise<ItemRead> {
    return await this.databaseService.item.update({
      where: { id: item.id },
      data: item,
      include: { itemCatalog: { select: { name: true, id: true } } },
    });
  }

  async deleteItem(itemId: string): Promise<ItemRead> {
    return await this.databaseService.item.delete({
      where: { id: itemId },
      include: { itemCatalog: { select: { name: true, id: true } } },
    });
  }
}
