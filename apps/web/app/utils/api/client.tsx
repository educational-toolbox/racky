"use client";

import type { AppRouter } from "@educational-toolbox/racky-api/trpc/trpc.router";
import { createTRPCReact } from "@trpc/react-query";

if (!process.env.NEXT_PUBLIC_NESTJS_SERVER) {
  throw new Error("NEXT_PUBLIC_NESTJS_SERVER is not defined");
}

export const api = createTRPCReact<AppRouter>();
