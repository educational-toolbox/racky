"use client";

import { useAuth } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import { api } from "~/lib/api/client";
import { transformer } from "~/lib/api/transformer";
import { reactQueryClient as defaultQueryClient } from "~/lib/api/query-client";
import { env } from "../env";

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers?: Headers;
}) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => defaultQueryClient);

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            env.IS_DEV ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          transformer,
          url: `${env.SERVER_BASE}/trpc`,
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
        {props.children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </api.Provider>
  );
}
