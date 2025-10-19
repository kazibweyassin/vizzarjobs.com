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
  Sparkles
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
      
      {/* Hero Section - Andela Style */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              AI/ML Talent • Canada Focus
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
            >
              Build better AI/ML solutions — faster
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              There are more than 500 highly skilled AI/ML professionals in our talent pool. 
              Most in largely untapped markets. Ready to be placed quickly and effectively in Canada.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Link
                href="/talent-pool"
                className="group inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Hire AI/ML Talent
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/talent-pool/register"
                className="inline-flex items-center gap-3 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Join Our Talent Pool
              </Link>
            </motion.div>

            {/* What is Adaptive Hiring? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="pt-8"
            >
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                What is AI/ML Talent Matching?
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Andela Style */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Top-rated, highly skilled AI/ML talent pool</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">$50,000</div>
              <div className="text-gray-600 font-medium">Cost savings per talent hired through VizzarJobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">75%</div>
              <div className="text-gray-600 font-medium">Faster time to hire</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">40%</div>
              <div className="text-gray-600 font-medium">Faster project delivery</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
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
              Featured AI/ML Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover hand-picked positions from Canada's leading technology companies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {typeof job.company === 'object' && job.company?.name 
                        ? job.company.name 
                        : typeof job.company === 'string' 
                          ? job.company 
                          : "Company"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Canada</span>
                    </div>
                    
                    {job.salary && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} CAD</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatJobType(job.jobType || '')}</span>
                    </div>
                  </div>

                  {job.visaSponsorship && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Visa Sponsored
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/jobs?location=Canada&category=AI-ML"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All AI/ML Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
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