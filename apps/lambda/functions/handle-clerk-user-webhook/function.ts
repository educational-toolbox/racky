import type { PrismaClient } from './prisma';
import type { Handler } from 'aws-lambda';
import { Webhook } from 'svix';
import { client } from './prisma';
import { z } from 'zod';

interface Event {
  rawQueryString: string;
  requestContext: { http: { method: 'GET' | 'POST' | (string & {}) } };
  headers: Record<string, string>;
  body: string;
}

const INVAID_WEBHOOK_EVENT = new Error('Invalid webhook event');

const webhookEventSchema = z.object({
  type: z.enum(['user.created', 'user.updated']),
  data: z.object({
    email_addresses: z.array(
      z.object({
        email_address: z.string(),
        verification: z.object({
          status: z.string(),
        }),
      }),
    ),
    first_name: z.string(),
    last_name: z.string(),
    object: z.literal('user_email_address'),
    image_url: z.string(),
    id: z.string(),
  }),
});

type WebhookData = z.infer<typeof webhookEventSchema>['data'];

export const handler: Handler<Event> = async (event, _context) => {
  if (1 === 1) {
    const data = await client.organization.count();
    return { statusCode: 200, body: JSON.stringify({ message: 'OK', count: data }) };
  }
  try {
    if (!['GET', 'POST'].includes(event.requestContext.http.method)) {
      throw new Error('Unsupported method');
    }
    const wh = validateWebhookEvent(event);
    const validEmail = wh.data.email_addresses.find(
      (a) => a.verification.status === 'verified',
    );
    if (!validEmail) {
      throw INVAID_WEBHOOK_EVENT;
    }
    if (wh.type === 'user.created') {
      await handleUserCreated(wh.data, client);
    }
    if (wh.type === 'user.updated') {
      await handleUserUpdated(wh.data, client);
    }
    return { statusCode: 200, body: JSON.stringify({ message: 'OK' }) };
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ e }),
    };
  }
};

const validateWebhookEvent = (event: Event) => {
  const secretKey = process.env.CLERK_WEBHOOK_SECRET_KEY;
  if (!secretKey) {
    throw new Error('CLERK_WEBHOOK_SECRET_KEY is not set');
  }
  const svixHeaders = event.headers;
  const wh = new Webhook(secretKey);
  const evt = wh.verify(event.body, svixHeaders);
  const parsed = webhookEventSchema.safeParse(evt);
  if (!parsed.success) {
    throw INVAID_WEBHOOK_EVENT;
  }
  return parsed.data;
};

const handleUserCreated = async (data: WebhookData, client: PrismaClient) => {
  await client.user.create({
    data: {
      email: data.email_addresses[0].email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      id: data.id,
      role: 'USER',
    },
  });
};

const handleUserUpdated = async (data: WebhookData, client: PrismaClient) => {
  await client.user.update({
    where: { id: data.id },
    data: {
      email: data.email_addresses[0].email_address,
      firstName: data.first_name,
      lastName: data.last_name,
    },
  });
};
