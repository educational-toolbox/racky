import { z } from 'zod';

export const ItemSchemaRead = z.object({
  id: z.string(),
  name: z.string(),
  picture: z.string().nullable(),
  status: z.string(),
  itemCatalogId: z.string(),
});

export type ItemRead = z.infer<typeof ItemSchemaRead>;

export const ItemSchemaWrite = ItemSchemaRead.omit({ id: true });

export type ItemWrite = z.infer<typeof ItemSchemaWrite>;
