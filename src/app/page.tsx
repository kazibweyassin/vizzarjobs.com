"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { api } from "~/trpc/react";
import { RoleUpdateHandler } from "~/components/RoleUpdateHandler";
import { 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Building2,
  CheckCircle,
  Star,
  Brain,
  Code,
  Database,
  Sparkles,
  Zap,
  Shield,
  Play,
  TrendingUp,
  Globe,
  Award,
  Target,
  Briefcase,
  Search
} from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, prefix = "", suffix = "" }: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

// Featured Jobs Section Component
function FeaturedJobsSection() {
  const { data: jobsData, isLoading, error } = api.jobs.getAll.useQuery({
    limit: 6,
    location: "Canada",
  });

  // Safely extract jobs array with multiple fallbacks
  const jobs = jobsData && Array.isArray(jobsData.jobs)
    ? jobsData.jobs.filter((job: any) => job && job.company)
    : [];

  if (isLoading || !jobsData) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600">Unable to load jobs at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Tech Jobs in Canada
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover visa-sponsored opportunities with top Canadian tech companies
          </p>
        </motion.div>

        {Array.isArray(jobs) && jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.slice(0, 6).map((job: any, index: number) => (
              <motion.div
                key={job?.id ?? `job-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {job?.title ?? 'Job Title'}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">{job.company?.name ?? 'Company'}</span>
                    </div>
                    {job.location && (
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.visaSponsorship && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Visa Sponsorship
                    </span>
                  )}
                  {job.remote && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Remote
                    </span>
                  )}
                  {job.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>

                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} CAD
                    </span>
                  </div>
                )}

                <Link
                  href={`/jobs/${job?.id ?? '#'}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group"
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
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
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

export default function HomePage() {
  return (
    <div className="bg-white">
      <RoleUpdateHandler />
      
      {/* Enhanced Hero Section */}
      <section className="relative py-24 flex items-start bg-gray-800 overflow-hidden">
        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gray-900/65 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1580894896813-652ff5aa8146?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
            alt="Technology"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-5">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 right-20 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-32 left-16 w-12 h-12 bg-emerald-500/20 rounded-full blur-lg"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Enhanced Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 py-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">
                  Canada's Premier Tech Talent Platform
                </span>
              </motion.div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-left">
                <span className="block">Hire World-Class</span>
                <span className="block text-emerald-400">
                  Tech Talent
                </span>
                <span className="block">From Africa</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-4xl leading-relaxed text-left">
                Access pre-vetted software engineers, developers, DevOps specialists, data scientists, and tech professionals from Nigeria, Kenya, Uganda, and South Africa.
                <span className="block text-emerald-400 font-semibold mt-3">
                  We handle visa sponsorship. You get exceptional talent at 40% lower cost.
                </span>
              </p>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 items-start pt-6"
            >
              {/* Primary CTA - Browse Jobs */}
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Briefcase className="w-4 h-4" />
                <span>Browse Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              {/* Secondary CTA - Employers */}
              <Link
                href="/employers/hire"
                className="group inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Building2 className="w-4 h-4" />
                <span>Hire Tech Talent</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              {/* Tertiary CTA - Job Seekers */}
              <Link
                href="/talent-pool/register"
                className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-white/20 transition-all duration-300"
              >
                <Users className="w-4 h-4" />
                <span>Join Talent Pool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-8 pt-6"
            >
              <div className="flex items-center gap-3 text-white/80">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-base">Full visa sponsorship</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span className="text-base">48-hour candidate matching</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-base">Top 5% talent only</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Logo in Bottom Left */}
        <div className="absolute bottom-24 left-6 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"
          >
            <span className="text-gray-900 font-bold text-lg">V</span>
          </motion.div>
        </div>

        {/* Statistics Section */}
     
      </section>

      {/* Featured Jobs Section */}
      <FeaturedJobsSection />

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How VizzarJobs Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From search to hire in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Tell Us Your Needs
              </h3>
              <p className="text-gray-600 text-center text-base">
                Share your role requirements, tech stack, and timeline. 
                We'll understand your exact hiring needs and budget.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Meet Pre-Vetted Candidates
              </h3>
              <p className="text-gray-600 text-center text-base">
                Within 48 hours, we present 3-5 qualified candidates 
                matched to your specific requirements with verified skills.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Hire with Confidence
              </h3>
              <p className="text-gray-600 text-center text-base">
                Interview, select, and we handle all visa sponsorship paperwork. 
                Your new team member starts in weeks, not months.
              </p>
            </motion.div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/employers/hire"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Hiring Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose VizzarJobs Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VizzarJobs?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just another job board. We're your strategic partner for building world-class tech teams.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Africa's Top Tech Talent",
                description: "Access highly skilled software engineers, developers, and tech professionals from Nigeria, Kenya, Uganda, and South Africa at 40% lower cost than North American hires."
              },
              {
                icon: CheckCircle,
                title: "Full Visa Sponsorship",
                description: "We handle all Canadian work permit applications, immigration paperwork, and relocation logistics from start to finish."
              },
              {
                icon: Zap,
                title: "48-Hour Candidate Matching",
                description: "Our curated talent pool means you meet qualified candidates within 2 days, not 2 months of searching."
              },
              {
                icon: Shield,
                title: "Pre-Vetted & Verified",
                description: "Every candidate undergoes technical assessments, background checks, and English proficiency testing before joining our pool."
              },
              {
                icon: Award,
                title: "Performance Guarantee",
                description: "30-day replacement guarantee if the hire doesn't meet your expectations. Your success is our priority."
              },
              {
                icon: Users,
                title: "Dedicated Support",
                description: "Your account manager guides you through hiring, onboarding, and provides support for the first 90 days."
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent, Performance-Based Pricing
            </h2>
            <p className="text-lg text-gray-600">
              No upfront fees. Only pay when you hire.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-12 border-2 border-gray-200 shadow-xl"
          >
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-3">
                  15% of first year salary
                </div>
                <div className="text-xl text-gray-600">One-time placement fee</div>
              </div>

              <div className="pt-8 border-t-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's Included:</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    "Full visa sponsorship & immigration support",
                    "Comprehensive background verification",
                    "Technical skills assessments",
                    "30-day replacement guarantee",
                    "Relocation & onboarding support",
                    "90-day dedicated account management"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 text-center">
                <Link
                  href="/employers/hire"
                  className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Schedule a Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-gray-500 text-sm mt-4">
                  Free consultation • No commitment required
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-blue-100">
              Whether you're hiring or looking for opportunities, we're here to help.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Employers */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border-2 border-white/20 hover:border-white/40 transition-all"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                For Employers
              </h3>
              <p className="text-blue-100 text-base mb-8 leading-relaxed">
                Build your tech team with world-class African talent. 
                We handle everything from sourcing to visa sponsorship.
              </p>
              <Link
                href="/employers/hire"
                className="inline-flex items-center gap-3 bg-white text-blue-600 px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full justify-center"
              >
                Start Hiring
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* For Job Seekers */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -8 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border-2 border-white/20 hover:border-white/40 transition-all"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                For Tech Professionals
              </h3>
              <p className="text-blue-100 text-base mb-8 leading-relaxed">
                Launch your career in Canada with visa-sponsored opportunities 
                at leading tech companies and innovative startups.
              </p>
              <Link
                href="/talent-pool/register"
                className="inline-flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full justify-center"
              >
                Join Talent Pool
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}