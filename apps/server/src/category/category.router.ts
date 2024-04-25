import { Injectable } from '@nestjs/common';
import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { z } from 'zod';
import { CategoryService } from '@educational-toolbox/racky-api/category/category.service';
import { CategorySchema } from '@educational-toolbox/racky-api/category/category.schema';

@Injectable()
export class CategoryRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly categoryService: CategoryService,
  ) {}

  categoryRouter = this.trpc.router({
    getCategories: this.trpc.procedure
      .meta({ openapi: { method: 'GET', path: '/categories' } })
      .input(z.void())
      .output(z.array(CategorySchema))
      .query(() => this.categoryService.getAllCategory('911')),

    addCategory: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'GET', path: '/category' } })
      .input(CategorySchema)
      .output(CategorySchema)
      .query(({ input }) => this.categoryService.createCategory(input)),

    editCategory: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'PUT', path: '/category' } })
      .input(CategorySchema)
      .output(CategorySchema)
      .query(({ input }) => this.categoryService.editCategory(input)),

    deleteCategory: this.trpc.protectedProcedure
      .meta({ openapi: { method: 'DELETE', path: '/category' } })
      .input(z.object({ id: z.string() }))
      .output(CategorySchema)
      .query(({ input }) => this.categoryService.deleteCategory(input.id)),
  });
}
