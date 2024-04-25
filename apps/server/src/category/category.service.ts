import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@educational-toolbox/racky-api/database/database.service';
import { CategorySchema } from '@educational-toolbox/racky-api/category/category.schema';
import { z } from 'zod';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllCategory(clientId: string) {
    return this.databaseService.category.findMany({
      where: {
        clientId: clientId,
      },
    });
  }

  createCategory(category: z.infer<typeof CategorySchema>) {
    return this.databaseService.category.create({
      data: category,
    });
  }

  editCategory(category: any) {
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
