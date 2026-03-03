"use client";

import Link from "next/link";
import {
  Plane,
  Globe,
  Users,
  Target,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function AboutUsPage() {
  const milestones = [
    { label: "Founded", value: "2024", sub: "Born in Kampala ðŸ‡ºðŸ‡¬" },
    { label: "Jobs Listed", value: "500+", sub: "Visa-sponsored roles" },
    { label: "Countries", value: "15+", sub: "Destination countries" },
    { label: "Professionals", value: "2,000+", sub: "East African talent" },
  ];

  const values = [
    {
      icon: Plane,
      title: "Visa-First by Design",
      desc: "Every feature â€” from search filters to job alerts â€” is built around visa sponsorship. It's not an afterthought; it's the whole product.",
    },
    {
      icon: Target,
      title: "Honest and Transparent",
      desc: "We only list jobs that explicitly offer visa sponsorship. No misleading listings, no bait-and-switch. Your time is valuable.",
    },
    {
      icon: Globe,
      title: "East Africa Focused",
      desc: "We understand the unique challenges facing Ugandan, Kenyan, Rwandan, and Tanzanian professionals navigating international career moves.",
    },
    {
      icon: Users,
      title: "Community Over Commerce",
      desc: "We reinvest in resources, guides, and support that help you through every step of the visa application and relocation process.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#0F2C4C] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Plane className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            We built the job board we{" "}
            <span className="text-amber-400">wish had existed</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Talented East African professionals were losing months chasing job listings that didn&apos;t offer visa sponsorship. We fixed that.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {milestones.map(({ label, value, sub }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-[#0F2C4C]">{value}</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-12 flex-col md:flex-row">
            <aside className="md:w-56 flex-shrink-0">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#0F2C4C]/40 mb-3">Navigation</h2>
              <nav className="space-y-1">
                {[
                  { label: "Our story", href: "/about" },
                  { label: "Contact us", href: "/contact" },
                  { label: "Privacy policy", href: "/privacy-policy" },
                  { label: "Terms of service", href: "/terms-of-service" },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="block text-sm py-2 text-gray-500 hover:text-[#0F2C4C] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </aside>

            <main className="flex-1 space-y-14">
              {/* What we are */}
              <div>
                <h3 className="text-xl font-bold text-[#0F2C4C] mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded-full inline-block" />
                  What we are
                </h3>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    VizzarJobs is East Africa&apos;s only job board built exclusively around <strong className="text-[#0F2C4C]">visa-sponsored international careers</strong>. Every listing on our platform includes employer-confirmed visa sponsorship â€” so you stop wasting time on roles that will never get you across the border.
                  </p>
                  <p>
                    The name says it all: <strong className="text-[#0F2C4C]">Vizzar = Visa + Wizard</strong>. We&apos;re the guide that takes you from &ldquo;I want to work internationally&rdquo; to &ldquo;my work permit is approved&rdquo; â€” with verified opportunities in the UAE, UK, Canada, Germany, Netherlands, and more.
                  </p>
                </div>
              </div>

              {/* Mission */}
              <div>
                <h3 className="text-xl font-bold text-[#0F2C4C] mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded-full inline-block" />
                  Our mission
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  To make international employment accessible to every talented East African professional â€” by eliminating the noise between ambition and opportunity. We believe the best talent shouldn&apos;t be held back by borders, and employers worldwide need to see what East Africa has to offer.
                </p>
              </div>

              {/* Values */}
              <div>
                <h3 className="text-xl font-bold text-[#0F2C4C] mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded-full inline-block" />
                  How we work
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {values.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="p-5 rounded-xl border border-gray-100 hover:border-[#0F2C4C]/20 transition-colors bg-gray-50/50">
                      <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <h4 className="font-semibold text-[#0F2C4C] text-sm mb-1">{title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-bold text-[#0F2C4C] mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded-full inline-block" />
                  Talk to us
                </h3>
                <div className="space-y-3 mb-6">
                  <a href="mailto:hello@vizzarjobs.com" className="flex items-center gap-3 text-gray-600 hover:text-[#0F2C4C] transition-colors text-sm">
                    <Mail className="w-4 h-4 text-amber-500" /> hello@vizzarjobs.com
                  </a>
                  <a href="tel:+256704833021" className="flex items-center gap-3 text-gray-600 hover:text-[#0F2C4C] transition-colors text-sm">
                    <Phone className="w-4 h-4 text-amber-500" /> +256 704 833 021
                  </a>
                  <span className="flex items-center gap-3 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 text-amber-500" /> Kampala, Uganda
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold px-5 py-3 rounded-lg text-sm transition-all"
                >
                  Get in touch <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#0F2C4C] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to find a job that moves you abroad?
          </h2>
          <p className="text-white/60 mb-8">
            Browse hundreds of visa-sponsored roles â€” filtered, verified, and built for East African professionals.
          </p>
          <Link
            href="/jobs?visaSponsorship=true"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-black px-8 py-4 rounded-xl text-base transition-all shadow-lg"
          >
            <Plane className="w-5 h-5" />
            Browse Visa-Sponsored Jobs
          </Link>
        </div>
      </section>
    </div>
  );
}

