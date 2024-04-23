import { z } from 'zod';

export const CatogorySchema = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
});
