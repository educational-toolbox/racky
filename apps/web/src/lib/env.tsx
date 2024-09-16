export const env = {
  SERVER_BASE: import.meta.env.VITE_NESTJS_SERVER,
  PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  DEFAULT_ORGID: import.meta.env.VITE_DEFAULT_ORGANIZATION_ID,
  IS_DEV: import.meta.env.DEV,
} as const;

(
  ["SERVER_BASE", "PUBLISHABLE_KEY", "DEFAULT_ORGID"] as (keyof typeof env)[]
).forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing env variable: ${key}`);
  }
  if (typeof env[key] !== "string") {
    throw new Error(`Invalid env variable: ${key}`);
  }
});
