import { z } from 'zod';

export const webhookEventSchema = z.object({
  data: z.object({
    email_addresses: z
      .array(
        z.object({
          email_address: z.string(),
          verification: z.object({
            status: z.enum(['verified']),
          }),
        }),
      )
      .nonempty(),
    first_name: z.string(),
    has_image: z.boolean(),
    id: z.string(),
    image_url: z.string(),
    last_name: z.string(),
    profile_image_url: z.string(),
  }),
  type: z.enum(['user.created', 'user.updated']),
});

export type WebhookData = z.infer<typeof webhookEventSchema>;
