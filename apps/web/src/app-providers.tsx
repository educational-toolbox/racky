import { ClerkProvider } from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { TooltipProvider } from "~/components/ui/tooltip";
import { TRPCReactProvider } from "./lib/api/provider";
import { SessionProvider } from "./lib/auth";
import { env } from "./lib/env";
import { OrganizationIdProvider } from "./pages/dashboard/organization-context";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider publishableKey={env.PUBLISHABLE_KEY} afterSignOutUrl="/">
      <TRPCReactProvider>
        <SessionProvider>
          <OrganizationIdProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster />
            </ThemeProvider>
          </OrganizationIdProvider>
        </SessionProvider>
      </TRPCReactProvider>
    </ClerkProvider>
  );
};
