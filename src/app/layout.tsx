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
import { ProfileCompletionProvider } from "~/components/ProfileCompletionProvider";
import { ProfileCompletionReminder } from "~/components/ProfileCompletionReminder";

export const metadata: Metadata = {
  title: "VizzarJobs | East Africa's Leading Professional Job Platform",
  description: "Find professional opportunities in Uganda, Kenya, Rwanda & East Africa. Browse jobs in Tech, Sales, Marketing, Finance, Customer Success & more. Your career starts here.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  verification: {
    google: "OpKfLTWY7tDBSSHFZ5_-fsJdtX5UO8Z3cGZgDabHsAE",
  },
  openGraph: {
    title: "VizzarJobs | East Africa's Leading Professional Job Platform",
    description: "Find professional opportunities in Uganda, Kenya, Rwanda & East Africa. Browse jobs in Tech, Sales, Marketing, Finance & more.",
    url: "https://vizzarjobs.com",
    siteName: "VizzarJobs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VizzarJobs - East Africa's Leading Professional Job Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VizzarJobs | East Africa's Leading Professional Job Platform",
    description: "Find professional opportunities in Uganda, Kenya, Rwanda & East Africa. Browse jobs in Tech, Sales, Marketing, Finance & more.",
    images: ["/images/og-image.jpg"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vizzarjobs.com"),
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
      <body className="min-h-screen bg-gradient-to-br from-white via-opal-2 to-opal-1">
        <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02] pointer-events-none" />
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <ProfileCompletionProvider>
              <GoogleAnalytics />
              <Navigation />
              <ProfileCompletionReminder />
              <LeadCaptureWrapper>
                <main className="relative z-10">{children}</main>
                <Footer />
                <RoleSelector />
              </LeadCaptureWrapper>
            </ProfileCompletionProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
