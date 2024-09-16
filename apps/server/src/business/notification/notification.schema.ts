import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  createdAt: z.coerce.date(),
});
