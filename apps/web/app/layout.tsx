import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { AppProviders } from "./app-providers";
import "./globals.css";
import { cn } from "./lib/utils";
import { Toaster } from "./components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className)} suppressHydrationWarning>
          <AppProviders>
            {props.children}
            <Toaster />
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}

export default RootLayout;
