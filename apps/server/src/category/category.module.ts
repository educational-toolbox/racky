import { CategoryRouter } from '@educational-toolbox/racky-api/category/category.router';
import { CategoryService } from '@educational-toolbox/racky-api/category/category.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [CategoryService, CategoryRouter],
  exports: [CategoryRouter],
})
export class CategoryModule {}
