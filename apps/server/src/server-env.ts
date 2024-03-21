function loadEnv<T extends string = string>(
  label: string,
  defaultValue?: T,
): T {
  const x = process.env[label];
  if (defaultValue != null && x == null) {
    return defaultValue;
  }
  if (x == null) {
    throw new Error(`Expected ${label} to be defined`);
  }
  return x as T;
}

const NEXT_PUBLIC_NESTJS_SERVER = loadEnv('NEXT_PUBLIC_NESTJS_SERVER');
const CLERK_PUBLIC_KEY = loadEnv('CLERK_PUBLIC_KEY');
const AUTH_PROVIDER = loadEnv<'RANDOM' | 'CLERK'>('AUTH_PROVIDER', 'RANDOM');

export const env = {
  NEXT_PUBLIC_NESTJS_SERVER,
  CLERK_PUBLIC_KEY,
  AUTH_PROVIDER,
};
