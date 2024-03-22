import { Inter } from "next/font/google";
import { TRPCReactProvider } from "./providers";
import { headers } from "next/headers";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import { cn } from "./lib/utils";

const inter = Inter({ subsets: ["latin"] });

function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "container mx-auto")}>
        <TRPCReactProvider headers={headers()}>
          {props.children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}

export default RootLayout;
