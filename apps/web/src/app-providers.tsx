import { ClerkProvider } from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { TRPCReactProvider } from "./lib/api/provider";
import { env } from "./lib/env";
import { SessionProvider } from "./lib/auth";
import { TooltipProvider } from "./components/ui/tooltip";
import { OrganizationIdProvider } from "./pages/dashboard/organization-context";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider publishableKey={env.PUBLISHABLE_KEY} afterSignOutUrl="/">
      <TRPCReactProvider>
        <SessionProvider>
          <OrganizationIdProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
          </OrganizationIdProvider>
        </SessionProvider>
      </TRPCReactProvider>
    </ClerkProvider>
  );
};
