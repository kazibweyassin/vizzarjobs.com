import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next"

import { TRPCReactProvider } from "~/trpc/react";
import { auth } from "~/server/auth";
import { Navigation } from "~/components/Navigation";
import { RoleSelector } from "~/components/RoleSelector";
import { Footer } from "~/components/Footer";
import { GoogleAnalytics } from "~/components/analytics/GoogleAnalytics";
import { LeadCaptureWrapper } from "~/components/LeadCaptureWrapper";

export const metadata: Metadata = {
  title: "VizzarJobs | Premium Visa-Sponsored Tech Opportunities",
  description: "Exclusive visa-sponsored tech positions for elite African professionals. Join our curated talent network for global career advancement.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-white via-[#f8faff] to-[#f0f4ff]">
        <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02] pointer-events-none" />
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <GoogleAnalytics />
            <Navigation />
            <LeadCaptureWrapper>
              <main className="relative z-10">{children}</main>
              <Footer />
              <RoleSelector />
            </LeadCaptureWrapper>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
