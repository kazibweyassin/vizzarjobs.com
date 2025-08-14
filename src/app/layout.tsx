import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { auth } from "~/server/auth";
import { Navigation } from "~/components/Navigation";
import { RoleSelector } from "~/components/RoleSelector";
import { Footer } from "~/components/Footer";

export const metadata: Metadata = {
  title: "VizzarJobs - Visa-Sponsored Tech Jobs for African Professionals",
  description: "Find visa-sponsored tech jobs worldwide. Connecting African tech talent with global opportunities.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
            <RoleSelector />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
