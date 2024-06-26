import type { PrismaClient } from './prisma';
import type { Handler } from 'aws-lambda';
import { Webhook } from 'svix';
import { client } from './prisma';
import { webhookEventSchema, type WebhookData } from './parse-webhook';

interface Event {
  rawQueryString: string;
  requestContext: { http: { method: 'GET' | 'POST' | (string & {}) } };
  headers: Record<string, string>;
  body: string;
}

const INVAID_WEBHOOK_EVENT = new Error('Invalid webhook event');

export const handler: Handler<Event> = async (event, _context) => {
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

const handleUserCreated = async (
  data: WebhookData['data'],
  client: PrismaClient,
) => {
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

const handleUserUpdated = async (
  data: WebhookData['data'],
  client: PrismaClient,
) => {
  await client.user.update({
    where: { id: data.id },
    data: {
      email: data.email_addresses[0].email_address,
      firstName: data.first_name,
      lastName: data.last_name,
    },
  });
};
