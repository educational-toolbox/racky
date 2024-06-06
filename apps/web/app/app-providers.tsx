import { headers } from "next/headers";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
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
        <TooltipProvider delayDuration={0}>{props.children}</TooltipProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
