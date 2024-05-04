import { z } from 'zod';

export const CategorySchemaRead = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
});

export type CategoryRead = z.infer<typeof CategorySchemaRead>;
export const CategorySchemaWrite = CategorySchemaRead.omit({ id: true });

export type CategoryWrite = z.infer<typeof CategorySchemaWrite>;
