"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Check,
  Zap,
  Users,
  Building2,
  Star,
  ArrowRight,
  Briefcase,
  Eye,
  Target,
  Shield,
  Globe,
  MessageSquare,
} from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    badge: null,
    description: "List your first job and see if VizzarJobs works for your hiring pipeline.",
    features: [
      "1 active job listing",
      "Standard listing visibility",
      "Basic candidate profiles",
      "Email applications",
      "30-day listing duration",
    ],
    cta: "Post a free job",
    ctaHref: "/post-job",
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: { monthly: 99, yearly: 990 },
    badge: "Most popular",
    description:
      "For companies actively hiring East African talent — local or international with visa sponsorship.",
    features: [
      "5 active job listings",
      "Featured placement in search results",
      "Visa-sponsorship badge on listings",
      "Full candidate profile access",
      "Applicant tracking dashboard",
      "Priority support",
      "60-day listing duration",
    ],
    cta: "Start hiring",
    ctaHref: "/auth/signup?role=EMPLOYER&plan=growth",
    highlight: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: { monthly: 249, yearly: 2490 },
    badge: "Best value",
    description:
      "High-volume hiring with access to our verified East African talent pool and employer branding.",
    features: [
      "Unlimited job listings",
      "Top-of-results placement",
      "Visa-sponsorship badge on all listings",
      "Talent pool access (5,000+ candidates)",
      "Bulk candidate outreach (50/mo)",
      "Dedicated account manager",
      "Company profile page",
      "90-day listing duration",
    ],
    cta: "Contact sales",
    ctaHref: "/contact?intent=employer-scale",
    highlight: false,
  },
];

const TALENT_POOL_PLAN = {
  name: "Talent Pool Access",
  price: { monthly: 149, yearly: 1490 },
  description:
    "Skip job posts entirely. Search our verified pool of 5,000+ East African professionals and reach out directly.",
  features: [
    "Search by skills, experience, country & availability",
    "Filter by visa-sponsorship-needed status",
    "50 direct candidate messages per month",
    "Download CV on request",
    "Bookmark shortlisted candidates",
    "Export to ATS (CSV)",
  ],
};

const TRUST_ITEMS = [
  { icon: Shield, label: "All candidates manually verified" },
  { icon: Globe, label: "Active in Uganda, Kenya & Rwanda" },
  { icon: Target, label: "Visa-sponsorship intent captured at signup" },
  { icon: MessageSquare, label: "Dedicated employer support" },
];

export default function EmployerPricingPage() {
  const { data: session } = useSession();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO ─── */}
      <section className="bg-[#0F2C4C] pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-semibold">For Employers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Hire verified East African talent.<br />
            <span className="text-amber-400">With or without visa sponsorship.</span>
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto mb-10">
            Post jobs to a qualified audience of East African professionals actively
            looking for roles in UAE, UK, Canada, Germany, Netherlands — and locally
            in Uganda, Kenya and Rwanda.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-white/10 rounded-full p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                billing === "monthly"
                  ? "bg-white text-[#0F2C4C]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                billing === "yearly"
                  ? "bg-white text-[#0F2C4C]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs bg-amber-400 text-[#0F2C4C] font-bold px-1.5 py-0.5 rounded-full">
                −17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── PLANS ─── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border-2 p-8 flex flex-col ${
                  plan.highlight
                    ? "border-amber-400 bg-white shadow-xl shadow-amber-100"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-[#0F2C4C] text-xs font-bold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-3">
                    {plan.price.monthly === 0 ? (
                      <span className="text-4xl font-extrabold text-[#0F2C4C]">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-extrabold text-[#0F2C4C]">
                          ${billing === "monthly" ? plan.price.monthly : Math.round(plan.price.yearly / 12)}
                        </span>
                        <span className="text-gray-400 text-sm mb-1">/mo</span>
                      </>
                    )}
                  </div>
                  {billing === "yearly" && plan.price.monthly > 0 && (
                    <p className="text-xs text-emerald-600 font-semibold mb-2">
                      Billed ${plan.price.yearly}/year — save ${plan.price.monthly * 12 - plan.price.yearly}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={session?.user ? plan.ctaHref : `/auth/signup?role=EMPLOYER&plan=${plan.id}`}
                  className={`w-full text-center py-3 rounded-lg font-bold text-sm transition-all ${
                    plan.highlight
                      ? "bg-amber-400 hover:bg-amber-300 text-[#0F2C4C]"
                      : "bg-[#0F2C4C] hover:bg-[#1a3d63] text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TALENT POOL ADD-ON ─── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#0F2C4C] to-[#1a4a7a] rounded-2xl p-10 text-white"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300 text-sm font-bold uppercase tracking-wider">
                    Talent Pool Add-on
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {TALENT_POOL_PLAN.name}
                </h2>
                <p className="text-white/65 text-sm leading-relaxed max-w-xl mb-6">
                  {TALENT_POOL_PLAN.description}
                </p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {TALENT_POOL_PLAN.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0 text-center md:text-right">
                <div className="mb-1">
                  <span className="text-4xl font-extrabold">
                    ${billing === "monthly" ? TALENT_POOL_PLAN.price.monthly : Math.round(TALENT_POOL_PLAN.price.yearly / 12)}
                  </span>
                  <span className="text-white/50 text-sm">/mo</span>
                </div>
                {billing === "yearly" && (
                  <p className="text-xs text-amber-300 font-semibold mb-3">
                    Save ${TALENT_POOL_PLAN.price.monthly * 12 - TALENT_POOL_PLAN.price.yearly}/year
                  </p>
                )}
                <Link
                  href="/contact?intent=talent-pool"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#0F2C4C] font-bold px-6 py-3 rounded-lg text-sm transition-all"
                >
                  Get access
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-white/40 text-xs mt-2">Can be added to any plan</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST SIGNALS ─── */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
            Why employers choose VizzarJobs
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-[#0F2C4C]/8 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#0F2C4C]" />
                </div>
                <p className="text-sm font-medium text-gray-700 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F2C4C] mb-8">Common questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Do I need to offer visa sponsorship to post jobs?",
                a: "No. You can post local Uganda, Kenya or Rwanda roles without any visa sponsorship. Visa sponsorship is an optional flag you add to listings — it gives your role extra visibility to candidates searching internationally.",
              },
              {
                q: "What counts as an 'active' job listing?",
                a: "A listing that is live and searchable on the platform. You can archive or close listings at any time without losing your monthly slot.",
              },
              {
                q: "Can I upgrade or downgrade plans mid-month?",
                a: "Yes. Upgrades take effect immediately and are prorated. Downgrades take effect at the next billing cycle.",
              },
              {
                q: "How is the Talent Pool different from job postings?",
                a: "Job postings are inbound — candidates apply to you. Talent Pool is outbound — you search for candidates and reach out directly. Both are available and can be combined.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept credit/debit cards (Visa, Mastercard), PayPal, MTN Mobile Money and Airtel Money — covering both international and East African employers.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-6">
                <p className="font-semibold text-gray-900 mb-2">{q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6 bg-amber-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-[#0F2C4C] mb-4">
            Ready to hire East African talent?
          </h2>
          <p className="text-[#0F2C4C]/70 mb-8">
            Post your first job free. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/post-job"
              className="inline-flex items-center gap-2 bg-[#0F2C4C] hover:bg-[#1a3d63] text-white font-bold px-8 py-4 rounded-lg transition-all"
            >
              <Briefcase className="w-5 h-5" />
              Post a free job
            </Link>
            <Link
              href="/contact?intent=employer"
              className="inline-flex items-center gap-2 bg-white/30 hover:bg-white/50 text-[#0F2C4C] font-bold px-8 py-4 rounded-lg transition-all"
            >
              Talk to sales
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
