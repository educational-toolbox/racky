import { Injectable } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';
import {
  CategorySchemaRead,
  CategoryWrite,
} from '~/business/category/category.schema';
import { z } from 'zod';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllCategory(organizationId: string) {
    return this.databaseService.category.findMany({
      where: {
        organizationId,
      },
    });
  }

  createCategory(category: CategoryWrite) {
    return this.databaseService.category.create({
      data: category,
    });
  }

  editCategory(category: z.infer<typeof CategorySchemaRead>) {
    return this.databaseService.category.update({
      where: { id: category.id },
      data: category,
    });
  }

  deleteCategory(categoryId: string) {
    return this.databaseService.category.delete({
      where: { id: categoryId },
    });
  }
}
