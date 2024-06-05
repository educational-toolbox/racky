import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { TooltipProvider } from "~/components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import "./globals.css";
import { cn } from "./lib/utils";
import { TRPCReactProvider } from "./providers";
import { ThemeProvider } from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider headers={headers()}>
              <TooltipProvider delayDuration={0}>
                {props.children}
                <Toaster richColors />
              </TooltipProvider>
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

export default RootLayout;
