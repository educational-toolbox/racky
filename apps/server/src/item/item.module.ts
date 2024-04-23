import { DatabaseModule } from '@educational-toolbox/racky-api/database/database.module';
import { Module } from '@nestjs/common';
import { ItemRouter } from '@educational-toolbox/racky-api/item/item.router';
import { ItemService } from '@educational-toolbox/racky-api/item/item.service';

@Module({
  imports: [DatabaseModule],
  providers: [ItemService, ItemRouter],
  exports: [ItemRouter],
})
export class ItemModule {}
