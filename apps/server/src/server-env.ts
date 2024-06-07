function loadEnv<T extends readonly string[] = readonly string[]>(
  label: string,
  defaultValue?: T[number],
  allowedValues?: T,
): T[number] {
  const x = process.env[label];
  if (defaultValue === 'undefined' && x == null) {
    return undefined as unknown as T[number];
  }
  if (defaultValue != null && x == null) {
    return defaultValue;
  }
  if (x == null) {
    throw new Error(`Expected ${label} to be defined`);
  }
  if (allowedValues && !allowedValues.includes(x)) {
    throw new Error(`Expected ${label} to be of values: ${allowedValues}`);
  }
  return x;
}

const NEXT_PUBLIC_NESTJS_SERVER = loadEnv('NEXT_PUBLIC_NESTJS_SERVER');
const CLERK_PUBLIC_KEY = loadEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
const CLERK_SECRET_KEY = loadEnv('CLERK_SECRET_KEY');
const AUTH_PROVIDER = loadEnv('AUTH_PROVIDER', 'unsafe_random', [
  'unsafe_random',
  'clerk',
] as const);

const AWS_REGION = loadEnv('AWS_REGION');
const AWS_ACCESS_KEY_ID = loadEnv('AWS_ACCESS_KEY_ID');
const AWS_SECRET_ACCESS_KEY = loadEnv('AWS_SECRET_ACCESS_KEY');
const AWS_BUCKET_NAME = loadEnv('AWS_BUCKET');
const AWS_S3_BUCKET_KEY = loadEnv('AWS_S3_BUCKET_KEY');

const REDIS_URL = loadEnv('REDIS_URL', 'undefined') as string | undefined;

export const env = {
  NEXT_PUBLIC_NESTJS_SERVER,
  CLERK_PUBLIC_KEY,
  CLERK_SECRET_KEY,
  AUTH_PROVIDER,
  REDIS_URL,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_S3_BUCKET_KEY,
};
