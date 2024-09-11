import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ItemRead, ItemWrite } from './item.schema';
import type { Prisma } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getItemById(itemId: string): Promise<ItemRead | null> {
    return await this.databaseService.item.findUnique({
      where: { id: itemId },
      include: { catalogueItem: { select: { name: true, id: true } } },
    });
  }

  async getItems(
    orgId: string,
    categoryId?: string,
    catalogId?: string,
    name?: string,
  ): Promise<ItemRead[]> {
    const query: Prisma.ItemWhereInput = {
      name: { contains: name, mode: 'insensitive' },
      catalogueItem: { organizationId: orgId },
    };
    if (categoryId) {
      query.catalogueItem!.categories = { some: { id: categoryId } };
    }
    if (catalogId) {
      query.catalogueItemId = catalogId;
    }
    return await this.databaseService.item.findMany({
      where: query,
      include: { catalogueItem: { select: { name: true, id: true } } },
    });
  }

  async createItem(item: ItemWrite): Promise<ItemRead> {
    return await this.databaseService.item.create({
      data: {
        status: item.status,
        available: true,
        name: item.name,
        picture: item.picture,
        catalogueItemId: item.catalogueItemId,
      },
      include: { catalogueItem: { select: { name: true, id: true } } },
    });
  }

  async editItem(item: ItemWrite): Promise<ItemRead> {
    return await this.databaseService.item.update({
      where: { id: item.id },
      data: item,
      include: { catalogueItem: { select: { name: true, id: true } } },
    });
  }

  async deleteItem(itemId: string): Promise<ItemRead> {
    return await this.databaseService.item.delete({
      where: { id: itemId },
      include: { catalogueItem: { select: { name: true, id: true } } },
    });
  }
}
