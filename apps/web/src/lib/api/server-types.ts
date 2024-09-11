import type { AppRouter } from "@educational-toolbox/racky-api/trpc/trpc.router";

import { inferRouterOutputs, inferRouterInputs } from "@trpc/server";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Domain
export type Item = RouterOutputs["items"]["getItems"][0];
