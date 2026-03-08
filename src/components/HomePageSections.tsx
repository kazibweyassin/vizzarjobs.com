"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  DollarSign,
  Building2,
  CheckCircle,
  Shield,
  Globe,
  Award,
  Briefcase,
  Search,
  User,
  Laptop,
  TrendingUp as ChartUp,
  MessageSquare,
  DollarSign as Money,
  Target as Bullseye,
  Package,
  Palette,
  Settings,
  Plane,
  FileText,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeaturedJob {
  id: string;
  title: string;
  location: string | null;
  country: string;
  visaSponsorship: boolean;
  remote: boolean;
  featured: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  company: { name: string } | null;
}

interface HomePageSectionsProps {
  featuredJobs: FeaturedJob[];
  jobCount: number;
}

// ─── Featured Jobs ────────────────────────────────────────────────────────────
function FeaturedJobsSection({ jobs }: { jobs: FeaturedJob[] }) {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F2C4C]">
              Latest opportunities
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Visa-sponsored roles highlighted — apply before they fill up
            </p>
          </div>
          <Link
            href="/jobs?visaSponsorship=true"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-sm group"
          >
            Browse visa-sponsored jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                {job.visaSponsorship && (
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                    <Plane className="w-3 h-3" />
                    Visa Sponsored
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#0F2C4C] mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="text-sm">{job.company?.name ?? "Company"}</span>
                    </div>
                    {job.location && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.remote && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      Remote
                    </span>
                  )}
                  {job.featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#0F2C4C]/10 text-[#0F2C4C]">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="text-sm font-semibold">
                      ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}
                    </span>
                  </div>
                )}

                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex items-center gap-1.5 text-[#0F2C4C] hover:text-amber-600 font-semibold text-sm group transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300"
          >
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No jobs available at the moment.</p>
            <p className="text-sm text-gray-500">Check back soon for new opportunities!</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-[#0F2C4C] text-white px-7 py-3 rounded-lg font-semibold hover:bg-[#1a3d63] transition-all shadow-sm"
          >
            <Search className="w-5 h-5" />
            Browse All Jobs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function HomePageSections({ featuredJobs, jobCount }: HomePageSectionsProps) {
  return (
    <div className="bg-white">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-[#0F2C4C]">
        <div
          className="absolute inset-y-0 right-0 w-1/2 hidden lg:block"
          style={{ background: "linear-gradient(135deg, transparent 30%, rgba(245,158,11,0.08) 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 mb-8">
              <Plane className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-semibold tracking-wide">
                UAE · UK · Canada · Germany · Netherlands
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              East African professionals
              <span className="block text-amber-400 mt-1">
                get hired abroad — with visa sponsorship.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mb-10">
              Most job boards don&apos;t filter by visa sponsorship. VizzarJobs does. Browse
              roles at verified international employers who will sponsor your work visa — and
              local East African jobs while you wait.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
              <Link
                href="/jobs?visaSponsorship=true"
                className="inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold px-8 py-4 rounded-lg text-base transition-all duration-200 shadow-lg hover:shadow-amber-500/30 hover:shadow-xl"
              >
                <Search className="w-5 h-5" />
                Browse Visa-Sponsored Jobs
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/signup"
                className="text-white/70 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
              >
                Create free profile — get matched
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                "Visa-sponsored roles filtered to the top",
                "Local Uganda, Kenya & Rwanda jobs included",
                "Free for job seekers — always",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { stat: "90%+", label: "of job boards don't let you filter\nby visa sponsorship availability" },
              { stat: "5+ countries", label: "sponsoring East African talent —\nUAE, UK, Canada, Germany, Netherlands" },
              { stat: `${jobCount}+ jobs`, label: "live on the platform right now\nboth international and local" },
            ].map(({ stat, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <p className="text-4xl font-extrabold text-[#0F2C4C]">{stat}</p>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED JOBS ─── */}
      <FeaturedJobsSection jobs={featuredJobs} />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F2C4C] mb-3">
              From Kampala to anywhere — in 3 steps
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">
              No immigration jargon. No gatekeepers. Just verified jobs that will sponsor your visa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                icon: User,
                title: "Build your international profile",
                desc: "Upload your CV, set your target countries and salary. Our resume builder formats it for international applications automatically.",
              },
              {
                step: "02",
                icon: Search,
                title: 'Filter to visa-sponsored roles',
                desc: 'Toggle "Visa Sponsored" and choose your destination country. Only see roles from employers who will sponsor your work permit.',
              },
              {
                step: "03",
                icon: Plane,
                title: "Apply and track your status",
                desc: "One-click apply. Track every application in your dashboard. Get notified when employers view your profile.",
              },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-extrabold text-[#0F2C4C]/8 leading-none mb-4 select-none">
                  {step}
                </div>
                <div className="w-12 h-12 bg-[#0F2C4C] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-[#0F2C4C] mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold px-7 py-3.5 rounded-lg text-base transition-all duration-200"
            >
              Create free profile
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── JOB CATEGORIES ─── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F2C4C] mb-3">
              Browse by destination or industry
            </h2>
            <p className="text-gray-600 text-lg">
              International visa-sponsored roles and local East African jobs — all in one place.
            </p>
          </motion.div>

          <div className="mb-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Visa-Sponsored Destinations
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { flag: "🇦🇪", country: "UAE", city: "Dubai & Abu Dhabi" },
                { flag: "🇬🇧", country: "United Kingdom", city: "London & Manchester" },
                { flag: "🇨🇦", country: "Canada", city: "Toronto & Vancouver" },
                { flag: "🇩🇪", country: "Germany", city: "Berlin & Munich" },
                { flag: "🇳🇱", country: "Netherlands", city: "Amsterdam" },
              ].map(({ flag, country, city }) => (
                <Link key={country} href={`/jobs?visaSponsorship=true&location=${country}`}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-[#0F2C4C]/5 border border-[#0F2C4C]/10 hover:border-amber-400 hover:bg-amber-50 p-4 rounded-xl cursor-pointer transition-all text-center group"
                  >
                    <div className="text-3xl mb-2">{flag}</div>
                    <p className="text-sm font-bold text-[#0F2C4C] group-hover:text-amber-600 transition-colors">
                      {country}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{city}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Job Categories
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Laptop, label: "Technology & IT", href: "/jobs?category=technology" },
                { icon: ChartUp, label: "Sales & Business", href: "/jobs?category=sales" },
                { icon: MessageSquare, label: "Marketing", href: "/jobs?category=marketing" },
                { icon: Money, label: "Finance", href: "/jobs?category=finance" },
                { icon: Bullseye, label: "Customer Success", href: "/jobs?category=customer-success" },
                { icon: Package, label: "Product & PM", href: "/jobs?category=product" },
                { icon: Palette, label: "Design & Creative", href: "/jobs?category=design" },
                { icon: Settings, label: "Operations", href: "/jobs?category=operations" },
              ].map(({ icon: Icon, label, href }) => (
                <Link key={label} href={href}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="flex items-center gap-3 bg-gray-50 hover:bg-[#0F2C4C] border border-gray-200 hover:border-[#0F2C4C] p-4 rounded-xl cursor-pointer transition-all group"
                  >
                    <Icon className="w-5 h-5 text-[#0F2C4C] group-hover:text-amber-400 shrink-0 transition-colors" />
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-white transition-colors">
                      {label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY VIZZARJOBS ─── */}
      <section className="py-20 bg-[#0F2C4C]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              The only East African job board built for international careers
            </h2>
            <p className="text-white/60 text-lg max-w-2xl">
              BrighterMonday and Fuzu list local jobs. LinkedIn buries visa sponsorship info.
              VizzarJobs puts it front and center.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Plane, title: "Visa sponsorship is a first-class filter", description: "Not a hidden checkbox. Toggle it on and every result is a company that will sponsor your work permit." },
              { icon: Globe, title: "Destination-aware job search", description: "Filter by UAE, UK, Canada, Germany or Netherlands. See salary ranges. Know what to expect before you apply." },
              { icon: FileText, title: "International-format resume builder", description: "Your CV should look different for a Dubai role vs a Kampala role. Our builder formats both — download as PDF for $2." },
              { icon: Shield, title: "Employer verification", description: "Every company is manually verified. If they claim to sponsor visas, we confirm it. No fake listings." },
              { icon: MapPin, title: "Local jobs while you plan ahead", description: "Still need work in Kampala, Nairobi or Kigali? Local East African jobs are one tab away." },
              { icon: Award, title: "100% free for job seekers", description: "Create a profile, apply to visa-sponsored roles, build your resume — all at no cost, forever." },
            ].map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCAL EAST AFRICA ─── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Also hiring locally
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F2C4C]">
                Jobs in Uganda, Kenya &amp; Rwanda
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-[#0F2C4C] hover:text-amber-600 font-semibold text-sm transition-colors group"
            >
              Browse all locations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { flag: "🇺🇬", country: "Uganda", city: "Kampala" },
              { flag: "🇰🇪", country: "Kenya", city: "Nairobi" },
              { flag: "🇷🇼", country: "Rwanda", city: "Kigali" },
              { flag: "🌍", country: "Remote", city: "Work from anywhere" },
            ].map(({ flag, country, city }) => (
              <Link
                key={country}
                href={country === "Remote" ? "/jobs?remote=true" : `/jobs?location=${country}`}
              >
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white border-2 border-gray-200 hover:border-[#0F2C4C] p-5 rounded-xl cursor-pointer transition-all group text-center"
                >
                  <div className="text-3xl mb-2">{flag}</div>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#0F2C4C] transition-colors">{country}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{city}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 bg-amber-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2C4C] mb-4">
              Your next job might be in Dubai.<br />
              Your next visa application starts here.
            </h2>
            <p className="text-[#0F2C4C]/70 text-lg mb-10 max-w-xl mx-auto">
              Create your free profile, upload your CV, and start applying to visa-sponsored
              roles in minutes.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2.5 bg-[#0F2C4C] hover:bg-[#1a3d63] text-white font-bold px-10 py-4 rounded-lg text-base transition-all duration-200 shadow-lg"
            >
              <User className="w-5 h-5" />
              Create free account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-[#0F2C4C]/60 text-sm mt-5">
              Free for job seekers · No credit card · Takes 2 minutes
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
