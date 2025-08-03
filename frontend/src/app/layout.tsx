import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationMenu from "@/components/Navigation/NavigationMenu";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import Header from "@/components/Header/Header";
import Head from "next/head";
import { AuthProvider } from "@/lib/auth/authContext";

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
  return (
    <html lang="en" className="min-h-screen relative bg-background text-background-content">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <body className={`${inter.className} max-w-[48rem] m-auto`}>
        <AuthProvider>
          <ReactQueryProvider>
              <Header />
              <main className="p-4 pb-24 relative flex flex-col">
                {children}
              </main>
              <NavigationMenu />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
