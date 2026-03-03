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
  title: "VizzarJobs | Visa-Sponsored Jobs for East African Professionals",
  description: "Find verified visa-sponsored jobs in UAE, UK, Canada, Germany & the Netherlands — plus local roles in Uganda, Kenya & Rwanda. Free for job seekers.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  verification: {
    google: "OpKfLTWY7tDBSSHFZ5_-fsJdtX5UO8Z3cGZgDabHsAE",
  },
  keywords: ["visa sponsored jobs Uganda", "visa sponsored jobs Kenya", "jobs in UAE for Ugandans", "work permit jobs East Africa", "international jobs Uganda", "visa sponsorship jobs Africa"],
  openGraph: {
    title: "VizzarJobs | Visa-Sponsored Jobs for East African Professionals",
    description: "Verified employers who will sponsor your visa. UAE, UK, Canada, Germany, Netherlands — and local East African roles. Free for job seekers.",
    url: "https://vizzarjobs.com",
    siteName: "VizzarJobs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VizzarJobs - Visa-Sponsored Jobs for East African Professionals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VizzarJobs | Visa-Sponsored Jobs for East African Professionals",
    description: "Verified employers who will sponsor your visa. UAE, UK, Canada, Germany, Netherlands — and local East African roles.",
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
      <body className="min-h-screen bg-white">
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
