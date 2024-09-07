import type { AppRouter } from "@educational-toolbox/racky-api/trpc/trpc.router";
import { createTRPCReact } from "@trpc/react-query";

export const api = createTRPCReact<AppRouter>();
