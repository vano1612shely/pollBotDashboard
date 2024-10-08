import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/authProdiver";
const inter = Inter({ subsets: ["latin"] });
import { CookiesProvider } from "next-client-cookies/server";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/reactQueryProvider";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "Poll Bot Dashboard",
  description: "Poll bot dashboard",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "w-full min-h-screen bg-background")}
      >
        <CookiesProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <Toaster position="bottom-right" reverseOrder={false} />
              {children}
            </AuthProvider>
          </ReactQueryProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
