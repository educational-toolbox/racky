import { z } from 'zod';

export const CatalogItemSchemaRead = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
});

export type CatalogItemRead = z.infer<typeof CatalogItemSchemaRead>;

export const CatalogItemSchemaWrite = CatalogItemSchemaRead.omit({ id: true });

export type CatalogItemWrite = z.infer<typeof CatalogItemSchemaWrite>;
