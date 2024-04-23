import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string(),
  pictureOverride: z.string().nullable(),
  status: z.string(),
});

export const CatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
});
