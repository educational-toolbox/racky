import { auth } from "@clerk/nextjs/server";
import type { AppRouter } from "@educational-toolbox/racky-api/trpc/trpc.router";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { transformer } from "./transformer";

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
      transformer,
      async headers() {
        const { getToken } = auth();
        const token = await getToken();
        if (!token) {
          return {};
        }
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
