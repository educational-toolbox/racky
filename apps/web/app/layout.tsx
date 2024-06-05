import { Inter } from "next/font/google";
import { TRPCReactProvider } from "./providers";
import { headers } from "next/headers";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import { cn } from "./lib/utils";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Sidebar from '~/components/sidebar/Sidebar';

const inter = Inter({ subsets: ["latin"] });

function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={cn(inter.className, "container mx-auto")}>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header
      <Sidebar/>
      <TRPCReactProvider headers={headers()}>
        {props.children}
        <Toaster richColors />
      </TRPCReactProvider>
      </body>
      </html>
    </ClerkProvider>

  );
}

export default RootLayout;
