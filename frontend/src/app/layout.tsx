import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Drawer from "@/components/Drawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Track",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="en" className="min-h-[100vh] bg-background text-background-content">
      <body className={`${inter.className}`}>
        <SessionProvider>
          <Drawer>
            <main className="p-4 relative flex flex-col ">
              {children}
            </main>
          </Drawer>
        </SessionProvider>
      </body>
    </html>
  );
}
