import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { TooltipProvider } from "~/components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import "./globals.css";
import { cn } from "./lib/utils";
import { TRPCReactProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(inter.className)}>
          <TRPCReactProvider headers={headers()}>
            <TooltipProvider>
              {props.children}
              <Toaster richColors />
            </TooltipProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

export default RootLayout;
