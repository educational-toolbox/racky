import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@educational-toolbox/racky-api/database/database.service';

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

  createCategory(category: any) {
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
