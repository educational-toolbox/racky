import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  zone: z.string(),
  ownerId: z.string().nullable(),
});

export const createOrganizationSchema = organizationSchema.omit({
  id: true,
  ownerId: true,
});

export const editOrganizationSchema = createOrganizationSchema.extend({
  id: z.string(),
});
