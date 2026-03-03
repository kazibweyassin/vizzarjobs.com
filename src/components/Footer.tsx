
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plane,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F2C4C] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logowhite.png"
                alt="VizzarJobs"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white/70 mb-2 text-sm leading-relaxed max-w-xs">
              The only East African job board built for visa-sponsored international careers.
            </p>
            <p className="text-white/50 text-xs mb-6 max-w-xs">
              We help talented professionals from Uganda, Kenya, Rwanda & Tanzania land jobs abroad â€” with full visa support.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, label: "Facebook", href: "#" },
                { Icon: Twitter, label: "Twitter", href: "#" },
                { Icon: Instagram, label: "Instagram", href: "#" },
                { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-amber-500 hover:text-[#0F2C4C] transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "Browse All Jobs", href: "/jobs" },
                { label: "Visa Sponsored Jobs", href: "/jobs?visaSponsorship=true", highlight: true },
                { label: "Companies", href: "/companies" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "About Us", href: "/about" },
              ].map(({ label, href, highlight }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      highlight
                        ? "text-amber-400 hover:text-amber-300 font-medium"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {highlight && <Plane className="w-3.5 h-3.5" />}
                    {!highlight && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-5">For Employers</h4>
            <ul className="space-y-3">
              {[
                { label: "Post a Job", href: "/post-job" },
                { label: "Pricing", href: "/pricing" },
                { label: "Employer Dashboard", href: "/dashboard/employer" },
                { label: "Contact Sales", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                Kampala, Uganda
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="tel:+256704833021" className="text-white/60 hover:text-white transition-colors">
                  +256 704 833 021
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="mailto:hello@vizzarjobs.com" className="text-white/60 hover:text-white transition-colors">
                  hello@vizzarjobs.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-semibold text-white mb-1">
                Get visa-sponsored job alerts
              </h4>
              <p className="text-white/50 text-sm">New opportunities delivered to your inbox weekly.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-lg text-white placeholder:text-white/40 flex-1 md:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                aria-label="Email for alerts"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold text-sm transition-all whitespace-nowrap"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <p className="text-white/40 text-sm">
              &copy; {currentYear} VizzarJobs. All rights reserved. Built in Kampala ðŸ‡ºðŸ‡¬
            </p>
            <div className="flex items-center gap-5">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "FAQ", href: "/faq" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="text-white/40 hover:text-white text-sm transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
