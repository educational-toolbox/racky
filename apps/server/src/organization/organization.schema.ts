import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string(),
  zone: z.string(),
});

export const editOrganizationSchema = createOrganizationSchema.extend({
  id: z.string(),
});
