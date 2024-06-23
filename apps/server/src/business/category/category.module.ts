import { CategoryRouter } from '~/business/category/category.router';
import { CategoryService } from '~/business/category/category.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [CategoryService, CategoryRouter],
  exports: [CategoryRouter],
})
export class CategoryModule {}
