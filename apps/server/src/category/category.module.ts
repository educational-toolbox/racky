import { CategoryRouter } from '..//category/category.router';
import { CategoryService } from '..//category/category.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [CategoryService, CategoryRouter],
  exports: [CategoryRouter],
})
export class CategoryModule {}
