import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@educational-toolbox/racky-api/trpc/trpc.router";
import Superjson from "superjson";

if (!process.env.NEXT_PUBLIC_NESTJS_SERVER) {
  throw new Error("NEXT_PUBLIC_NESTJS_SERVER is not defined");
}

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_NESTJS_SERVER}/trpc`,
      transformer: new Superjson(),
    }),
  ],
});
