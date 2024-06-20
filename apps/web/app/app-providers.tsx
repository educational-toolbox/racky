import { headers } from "next/headers";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import { SessionProvider } from "./lib/auth";
import { TRPCReactProvider } from "./trpc-providers";

export function AppProviders(props: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider headers={headers()}>
        <SessionProvider>
          <TooltipProvider delayDuration={0}>{props.children}</TooltipProvider>
        </SessionProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
