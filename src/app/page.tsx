"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Shield
} from "lucide-react";

interface Company {
  name: string;
  location: string;
}

interface Job {
  id: string;
  title: string;
  company?: string | {
    id: string;
    name: string;
    location: string | null;
    [key: string]: any;
  };
  companyRelation?: Company;
  createdAt: Date;
  visaSponsorship: boolean;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | null;
  experienceLevel: 'ENTRY_LEVEL' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | null;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}

// Helper function to format job type
const formatJobType = (type: string): string => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Helper function to format experience level
const formatExperienceLevel = (level: string): string => {
  return level.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Fallback jobs data
const getFallbackJobs = (): Job[] => [
  {
    id: "1",
    title: "Senior Machine Learning Engineer",
    company: "Shopify",
    createdAt: new Date(),
    visaSponsorship: true,
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    salary: { min: 120000, max: 180000, currency: "CAD" }
  },
  {
    id: "2", 
    title: "AI Research Scientist",
    company: "DeepMind",
    createdAt: new Date(),
    visaSponsorship: true,
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    salary: { min: 150000, max: 220000, currency: "CAD" }
  },
  {
    id: "3",
    title: "Computer Vision Engineer",
    company: "Tesla",
    createdAt: new Date(),
    visaSponsorship: true,
    jobType: "FULL_TIME",
    experienceLevel: "MID",
    salary: { min: 100000, max: 140000, currency: "CAD" }
  },
  {
    id: "4",
    title: "NLP Engineer",
    company: "OpenAI",
    createdAt: new Date(),
    visaSponsorship: true,
    jobType: "FULL_TIME",
    experienceLevel: "MID",
    salary: { min: 110000, max: 160000, currency: "CAD" }
  },
  {
    id: "5",
    title: "Data Science Lead",
    company: "Microsoft",
    createdAt: new Date(),
    visaSponsorship: true,
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    salary: { min: 130000, max: 190000, currency: "CAD" }
  },
  {
    id: "6",
    title: "ML Infrastructure Engineer",
    company: "Google",
    createdAt: new Date(),
    visaSponsorship: true,
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    salary: { min: 140000, max: 200000, currency: "CAD" }
  }
];

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  
  // Use client-side tRPC query
  const { data: apiJobs, isLoading, error } = api.jobs.getFeatured.useQuery({ limit: 6 });
  
  useEffect(() => {
    if (apiJobs && Array.isArray(apiJobs) && apiJobs.length > 0) {
      setFeaturedJobs(apiJobs as Job[]);
    } else if (error || (!isLoading && (!apiJobs || apiJobs.length === 0))) {
      console.log('No featured jobs found in database, using fallback data');
      setFeaturedJobs(getFallbackJobs());
    }
  }, [apiJobs, isLoading, error]);

  return (
    <div className="bg-white">
      <RoleUpdateHandler />
      
      {/* Hero Section - Andela Style with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/60 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="AI/ML Technology"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-6 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white leading-tight text-left"
            >
              Build better AI/ML solutions — faster
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-4xl leading-relaxed text-left"
            >
              There are more than 500 highly skilled AI/ML professionals in our talent pool. 
              Most in largely untapped markets. Ready to be placed quickly and effectively in Canada.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 items-start pt-8"
            >
              <Link
                href="/talent-pool"
                className="group inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Hire AI/ML Talent
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors text-lg"
              >
                What is AI/ML Talent Matching?
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Logo in Bottom Left */}
        <div className="absolute bottom-6 left-6 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"
          >
            <span className="text-gray-900 font-bold text-lg">V</span>
          </motion.div>
        </div>

        {/* Statistics Section - Integrated into Hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-6 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <div className="text-center border-r border-white/20 pr-8">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80 font-medium">Top-rated, highly skilled AI/ML talent pool</div>
              </div>
              <div className="text-center border-r border-white/20 pr-8">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">$50,000</div>
                <div className="text-white/80 font-medium">Cost savings per talent hired through VizzarJobs</div>
              </div>
              <div className="text-center border-r border-white/20 pr-8">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">75%</div>
                <div className="text-white/80 font-medium">Faster time to hire</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">40%</div>
                <div className="text-white/80 font-medium">Faster project delivery</div>
              </div>
            </motion.div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose VizzarJobs?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another job board. We're Canada's premier AI/ML talent platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI/ML Expertise",
                description: "Our team understands AI/ML roles and can match you with the perfect opportunity."
              },
              {
                icon: CheckCircle,
                title: "Visa Support",
                description: "We handle Canadian work visa sponsorship for all our placements."
              },
              {
                icon: Star,
                title: "Premium Companies",
                description: "Access to Canada's most innovative AI/ML companies and startups."
              },
              {
                icon: Zap,
                title: "Fast Matching",
                description: "Our AI-powered matching connects you with opportunities in days, not months."
              },
              {
                icon: Shield,
                title: "Secure Process",
                description: "Your data is protected with enterprise-grade security and privacy controls."
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "Dedicated AI/ML career advisors to guide you through your journey."
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
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Make Your Mark?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join Canada's most innovative AI/ML companies and build the future of technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/talent-pool/register"
                className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}