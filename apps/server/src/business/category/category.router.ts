import { Injectable } from '@nestjs/common';
import { TrpcService } from '~/trpc/trpc.service';
import { z } from 'zod';
import { CategoryService } from '~/business/category/category.service';
import {
  CategorySchemaRead,
  CategorySchemaWrite,
} from '~/business/category/category.schema';
import { openapi } from './category.openapi';

@Injectable()
export class CategoryRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly categoryService: CategoryService,
  ) {}

  router = this.trpc.router({
    getCategories: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi().summary('Get all categories').build(),
      })
      .input(z.void())
      .output(z.array(CategorySchemaRead))
      .query(({ ctx }) => this.categoryService.getAllCategory(ctx.user.orgId)),

    addCategory: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi().method('POST').summary('Create a category').build(),
      })
      .input(CategorySchemaWrite)
      .output(CategorySchemaRead)
      .query(({ input }) => this.categoryService.createCategory(input)),

    editCategory: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .method('PUT')
          .segments('{id}')
          .summary('Update a category')
          .build(),
      })
      .input(CategorySchemaRead)
      .output(CategorySchemaRead)
      .query(({ input }) => this.categoryService.editCategory(input)),

    deleteCategory: this.trpc.assignedToOrgProcedure
      .meta({
        openapi: openapi()
          .method('DELETE')
          .segments('{id}')
          .summary('Delete a category')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(CategorySchemaRead)
      .query(({ input }) => this.categoryService.deleteCategory(input.id)),
  });
}
