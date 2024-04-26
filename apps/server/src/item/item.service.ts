import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@educational-toolbox/racky-api/database/database.service';

@Injectable()
export class ItemService {
  constructor(private readonly databaseService: DatabaseService) {}

  createItem(item: any) {
    return this.databaseService.item.create({ data: item });
  }

  editItem(item: any) {
    return this.databaseService.item.update({
      where: { id: item.id },
      data: item,
    });
  }

  deleteItem(itemId: string) {
    return this.databaseService.item.delete({ where: { id: itemId } });
  }

  addItemImage(image: Express.Multer.File) {
    console.log('img', image);
  }
}
