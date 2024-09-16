import { ItemStatus } from '@prisma/client';
import { z } from 'zod';

export const ItemSchemaRead = z.object({
  id: z.string(),
  name: z.string(),
  picture: z.string().nullable(),
  status: z.nativeEnum(ItemStatus),
  catalogueItemId: z.string(),
  catalogueItem: z.object({ id: z.string(), name: z.string() }),
});

export type ItemRead = z.infer<typeof ItemSchemaRead>;

export const ItemSchemaWrite = ItemSchemaRead.omit({
  id: true,
  catalogueItem: true,
}).extend({ id: z.string().optional() });

export type ItemWrite = z.infer<typeof ItemSchemaWrite>;
