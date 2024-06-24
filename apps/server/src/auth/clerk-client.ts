import { createClerkClient } from '@clerk/clerk-sdk-node';
import { env } from 'process';

export const clerkClient: ReturnType<typeof createClerkClient> =
  createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLIC_KEY,
  });
