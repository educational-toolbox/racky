import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string(),
  pictureOverride: z.string().nullable(),
  status: z.string(),
});
