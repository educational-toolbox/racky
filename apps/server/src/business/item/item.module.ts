import { ItemRouter } from '~/business/item/item.router';
import { ItemService } from '~/business/item/item.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [ItemService, ItemRouter],
  exports: [ItemRouter],
})
export class ItemModule {}
