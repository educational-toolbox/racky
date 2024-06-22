import { ItemRouter } from '..//item/item.router';
import { ItemService } from '..//item/item.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [ItemService, ItemRouter],
  exports: [ItemRouter],
})
export class ItemModule {}
