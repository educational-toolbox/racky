import { DatabaseModule } from '@educational-toolbox/racky-api/database/database.module';
import { Module } from '@nestjs/common';
import { CategoryService } from '@educational-toolbox/racky-api/category/category.service';
import { CategoryRouter } from '@educational-toolbox/racky-api/category/category.router';

@Module({
  imports: [DatabaseModule],
  providers: [CategoryService, CategoryRouter],
  exports: [CategoryRouter],
})
export class CategoryModule {}
