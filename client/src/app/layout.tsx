import type { Metadata } from "next";
import "./globals.css";
import { AuthInitializer } from "@/providers/AuthInitializer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Cravon",
  description: "The ultimate restaurant management and discovery platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
