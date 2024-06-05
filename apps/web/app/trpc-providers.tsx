"use client";

import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { httpBatchLink, loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { useState } from "react";

import { api } from "~/utils/api/client";
import { transformer } from "./utils/api/transformer";

if (!process.env.NEXT_PUBLIC_NESTJS_SERVER) {
  throw new Error("NEXT_PUBLIC_NESTJS_SERVER is not defined");
}

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers?: Headers;
}) {
  const { getToken } = useAuth();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          transformer,
          url: `${process.env.NEXT_PUBLIC_NESTJS_SERVER}/trpc`,
          async headers() {
            const token = await getToken();
            const headers = new Map(props.headers);
            headers.set("x-trpc-source", "nextjs-react");
            headers.set("Authorization", `Bearer ${token}`);
            return Object.fromEntries(headers);
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration transformer={transformer}>
          {props.children}
        </ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </api.Provider>
  );
}
