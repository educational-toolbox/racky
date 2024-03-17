import { Inter } from "next/font/google";
import { TRPCReactProvider } from "./providers";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactProvider headers={headers()}>
          {props.children}
          {/* <p>hi</p> */}
        </TRPCReactProvider>
      </body>
    </html>
  );
}

export default RootLayout;
