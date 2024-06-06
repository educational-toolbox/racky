import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { AppProviders } from "./app-providers";
import { Toaster } from "./components/ui/sonner";
import "./globals.css";
import { cn } from "./lib/utils";

const inter = Inter({ subsets: ["latin"] });

function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className)}>
          <AppProviders>
            {props.children}
            <Toaster richColors />
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}

export default RootLayout;
