import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@educational-toolbox/racky-api/database/database.service';
import {
  ItemRead,
  ItemWrite,
} from '@educational-toolbox/racky-api/item/item.schema';

@Injectable()
export class ItemService {
  constructor(private readonly databaseService: DatabaseService) {}

  createItem(item: ItemWrite) {
    return this.databaseService.item.create({
      data: {
        status: item.status,
        available: true,
        name: item.name,
        picture: item.pictureOverride,
        itemCatalogId: item.itemCatalogId,
      },
    });
  }

  editItem(item: ItemRead) {
    return this.databaseService.item.update({
      where: { id: item.id },
      data: item,
    });
  }

  deleteItem(itemId: string) {
    return this.databaseService.item.delete({ where: { id: itemId } });
  }
}
