"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { api } from "~/trpc/react";
import { RoleUpdateHandler } from "~/components/RoleUpdateHandler";
import { cleanJobs } from "~/lib/utils";


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
  Search,
  User,
  Laptop,
  TrendingUp as ChartUp,
  MessageSquare,
  DollarSign as Money,
  Target as Bullseye,
  Package,
  Palette,
  Settings
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
  });

  // Clean and validate imported jobs
  const jobs = jobsData && Array.isArray(jobsData.jobs) 
    ? cleanJobs(jobsData.jobs)
    : [];

  if (isLoading || !jobsData) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
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
            Latest Professional Opportunities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fresh job openings across Uganda, Kenya, Rwanda & East Africa
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
                  {job.remote && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Remote
                    </span>
                  )}
                  {job.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Featured
                    </span>
                  )}
                </div>

                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
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
                  🇺🇬 🇰🇪 🇷🇼 🇹🇿 East Africa's #1 Professional Job Platform
                </span>
              </motion.div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-left">
                <span className="block">Find Your Dream Job in</span>
                <span className="block text-emerald-400">
                  Uganda & East Africa
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-4xl leading-relaxed text-left">
                Browse thousands of professional opportunities in Tech, Sales, Marketing, Finance, Customer Success, and more.
                <span className="block text-emerald-400 font-semibold mt-3">
                  From local roles in Kampala & Nairobi to remote positions and international opportunities across Africa and beyond.
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
                className="group inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Search className="w-5 h-5" />
                <span>Find a Job</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              {/* Secondary CTA - Employers */}
              <Link
                href="/post-job"
                className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/20 transition-all duration-300"
              >
                <Building2 className="w-5 h-5" />
                <span>Post a Job</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              {/* Primary Sign Up CTA */}
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>Sign Up Free</span>
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
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span className="text-base">1000+ Active Jobs</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-base">Local & International</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-base">Free to Use</span>
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

      {/* Job Categories Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Jobs by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find opportunities across multiple industries in Uganda, Kenya, Rwanda & East Africa
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Technology & IT */}
            <Link href="/jobs?category=technology">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <Laptop className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Technology & IT
                </h3>
                <p className="text-sm text-gray-600">Software, DevOps, Data & more</p>
              </motion.div>
            </Link>

            {/* Sales & Business Development */}
            <Link href="/jobs?category=sales">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <ChartUp className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Sales & Business
                </h3>
                <p className="text-sm text-gray-600">Account Executives, BDRs & more</p>
              </motion.div>
            </Link>

            {/* Marketing & Communications */}
            <Link href="/jobs?category=marketing">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <MessageSquare className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Marketing
                </h3>
                <p className="text-sm text-gray-600">Digital, Content, Social & more</p>
              </motion.div>
            </Link>

            {/* Finance & Accounting */}
            <Link href="/jobs?category=finance">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <Money className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Finance
                </h3>
                <p className="text-sm text-gray-600">Accountants, Analysts & more</p>
              </motion.div>
            </Link>

            {/* Customer Success */}
            <Link href="/jobs?category=customer-success">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <Bullseye className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Customer Success
                </h3>
                <p className="text-sm text-gray-600">Support, Account Managers & more</p>
              </motion.div>
            </Link>

            {/* Product & Project Management */}
            <Link href="/jobs?category=product">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <Package className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Product & PM
                </h3>
                <p className="text-sm text-gray-600">Product, Project Managers & more</p>
              </motion.div>
            </Link>

            {/* Design & Creative */}
            <Link href="/jobs?category=design">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <Palette className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Design & Creative
                </h3>
                <p className="text-sm text-gray-600">UI/UX, Graphic Design & more</p>
              </motion.div>
            </Link>

            {/* Operations & Admin */}
            <Link href="/jobs?category=operations">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <Settings className="w-10 h-10 text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                  Operations
                </h3>
                <p className="text-sm text-gray-600">Office, HR, Admin & more</p>
              </motion.div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold group"
            >
              View All Categories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
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
              Find your dream job in 3 simple steps
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
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Create Your Profile
              </h3>
              <p className="text-gray-600 text-center text-base">
                Sign up for free and build your professional profile. 
                Upload your CV, showcase your skills, and set your job preferences.
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
                Browse & Apply
              </h3>
              <p className="text-gray-600 text-center text-base">
                Search thousands of jobs across multiple categories.
                Filter by location, industry, salary, and apply with one click.
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
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Get Hired
              </h3>
              <p className="text-gray-600 text-center text-base">
                Connect with employers, schedule interviews, and land your dream job.
                We're with you every step of the way.
              </p>
            </motion.div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Your Job Search Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Location Section */}
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
              Browse Jobs by Location
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find opportunities in major cities across East Africa and remote positions worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Uganda */}
            <Link href="/jobs?location=Uganda">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group text-center"
              >
                <div className="text-4xl mb-3">🇺🇬</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  Uganda
                </h3>
                <p className="text-sm text-gray-600">Kampala & more</p>
              </motion.div>
            </Link>

            {/* Kenya */}
            <Link href="/jobs?location=Kenya">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group text-center"
              >
                <div className="text-4xl mb-3">🇰🇪</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  Kenya
                </h3>
                <p className="text-sm text-gray-600">Nairobi & more</p>
              </motion.div>
            </Link>

            {/* Rwanda */}
            <Link href="/jobs?location=Rwanda">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group text-center"
              >
                <div className="text-4xl mb-3">🇷🇼</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  Rwanda
                </h3>
                <p className="text-sm text-gray-600">Kigali & more</p>
              </motion.div>
            </Link>

            {/* Tanzania */}
            <Link href="/jobs?location=Tanzania">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group text-center"
              >
                <div className="text-4xl mb-3">🇹🇿</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  Tanzania
                </h3>
                <p className="text-sm text-gray-600">Dar es Salaam</p>
              </motion.div>
            </Link>

            {/* Remote */}
            <Link href="/jobs?remote=true">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group text-center"
              >
                <Globe className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Remote
                </h3>
                <p className="text-sm text-gray-600">Work from anywhere</p>
              </motion.div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold group"
            >
              View All Locations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
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
              Your trusted partner for finding professional opportunities across East Africa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Diverse Job Categories",
                description: "Access opportunities across Technology, Sales, Marketing, Finance, Customer Success, Product, Design, and Operations."
              },
              {
                icon: MapPin,
                title: "Regional & International",
                description: "Find jobs in Uganda, Kenya, Rwanda, Tanzania, and remote positions with companies across the globe."
              },
              {
                icon: Zap,
                title: "Fast & Easy Applications",
                description: "Apply to multiple jobs with one click. Track your applications and get real-time updates on your status."
              },
              {
                icon: Shield,
                title: "Verified Companies",
                description: "All employers are verified. We ensure job postings are legitimate and companies are trustworthy."
              },
              {
                icon: Award,
                title: "Career Growth Tools",
                description: "Access career assessments, resume builders, interview tips, and professional development resources."
              },
              {
                icon: Users,
                title: "100% Free for Job Seekers",
                description: "Create your profile, browse jobs, and apply to unlimited positions at no cost. Forever free."
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
                  <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-emerald-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-base md:text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals finding opportunities across Uganda, Kenya, Rwanda & East Africa
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <User className="w-4 h-4" />
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-emerald-400 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Search className="w-4 h-4" />
                Browse Jobs Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-emerald-100 text-xs mt-6">
              ✓ 100% Free for Job Seekers  •  ✓ No Hidden Fees  •  ✓ Apply to Unlimited Jobs
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}