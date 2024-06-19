import { ItemRouter } from '@educational-toolbox/racky-api/item/item.router';
import { ItemService } from '@educational-toolbox/racky-api/item/item.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [ItemService, ItemRouter],
  exports: [ItemRouter],
})
export class ItemModule {}
