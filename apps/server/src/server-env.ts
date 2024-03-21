function loadEnv<T extends readonly string[] = readonly string[]>(
  label: string,
  allowedValues?: T,
  defaultValue?: T[number],
): T[number] {
  const x = process.env[label];
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
const CLERK_PUBLIC_KEY = loadEnv('CLERK_PUBLIC_KEY');
const AUTH_PROVIDER = loadEnv(
  'AUTH_PROVIDER',
  ['unsafe_random', 'clerk'] as const,
  'unsafe_random',
);

export const env = {
  NEXT_PUBLIC_NESTJS_SERVER,
  CLERK_PUBLIC_KEY,
  AUTH_PROVIDER,
};
