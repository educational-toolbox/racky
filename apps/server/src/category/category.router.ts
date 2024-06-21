import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { z } from 'zod';
import { CategoryService } from '@educational-toolbox/racky-api/category/category.service';
import {
  CategorySchemaRead,
  CategorySchemaWrite,
} from '@educational-toolbox/racky-api/category/category.schema';

@Injectable()
export class CategoryRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly categoryService: CategoryService,
  ) {}

  router = this.trpc.router({
    getCategories: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/categories',
          tags: ['Category'],
          summary: 'Get all categories',
          description: 'Get all categories from the database',
        },
      })
      .input(z.void())
      .output(z.array(CategorySchemaRead))
      .query(({ ctx }) => this.categoryService.getAllCategory(ctx.user.orgId)),

    addCategory: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: {
          method: 'POST',
          path: '/category',
          tags: ['Category'],
          summary: 'Create a category',
          description: 'Create a category in the database',
        },
      })
      .input(CategorySchemaWrite)
      .output(CategorySchemaRead)
      .query(({ input }) => this.categoryService.createCategory(input)),

    editCategory: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: {
          method: 'PUT',
          path: '/category',
          tags: ['Category'],
          summary: 'Update a category',
          description: 'Update a category in the database',
        },
      })
      .input(CategorySchemaRead)
      .output(CategorySchemaRead)
      .query(({ input }) => this.categoryService.editCategory(input)),

    deleteCategory: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: {
          method: 'DELETE',
          path: '/category',
          tags: ['Category'],
          summary: 'Delete a category',
          description: 'Delete a category from the database',
        },
      })
      .input(z.object({ id: z.string() }))
      .output(CategorySchemaRead)
      .query(({ input }) => this.categoryService.deleteCategory(input.id)),
  });
}
