'use client';

import Link from "next/link";
import { RoleUpdateHandler } from "~/components/RoleUpdateHandler";
import {
  Search,
  MapPin,
  Award,
  TrendingUp,
  Users,
  Globe,
  ArrowRight,
  Star,
  Building2,
  Clock,
  Briefcase,
  CheckCircle,
  Zap,
  Target,
  Sparkles,
  User
} from "lucide-react";
import {PremiumHero}  from "~/components/PremiumHero";
import { PremiumStats } from "~/components/PremiumStats";
import { PremiumFeatures } from "~/components/PremiumFeatures";
import { PremiumTestimonials } from "~/components/PremiumTestimonials";
import { PremiumHowItWorks } from "~/components/PremiumHowItWorks";
import { PremiumCard } from "~/components/ui/premium-card";
import HomePageClient from "~/components/HomePageClient";
import { ProfileCreationButton } from "~/components/ProfileCreationButton";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

// Define proper TypeScript interfaces
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
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | null;
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

// Helper function to get relative time
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

// Helper function to get fallback jobs with Canadian focus
const getFallbackJobs = (): Job[] => [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechFlow Solutions',
    companyRelation: {
      name: 'TechFlow Solutions',
      location: 'Toronto, Canada'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    visaSponsorship: false,
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salary: {
      min: 90000,
      max: 130000,
      currency: 'CAD'
    }
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'CloudScale Inc',
    companyRelation: {
      name: 'CloudScale Inc',
      location: 'Vancouver, Canada'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    visaSponsorship: false,
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salary: {
      min: 85000,
      max: 115000,
      currency: 'CAD'
    }
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'InfraMax',
    companyRelation: {
      name: 'InfraMax',
      location: 'Montreal, Canada'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    visaSponsorship: false,
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salary: {
      min: 95000,
      max: 125000,
      currency: 'CAD'
    }
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'StartupHub',
    companyRelation: {
      name: 'StartupHub',
      location: 'Ottawa, Canada'
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    visaSponsorship: false,
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salary: {
      min: 80000,
      max: 105000,
      currency: 'CAD'
    }
  },
  {
    id: '5',
    title: 'Mobile App Developer',
    company: 'AppCraft Studios',
    companyRelation: {
      name: 'AppCraft Studios',
      location: 'Toronto, Canada'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    visaSponsorship: false,
    jobType: 'CONTRACT',
    experienceLevel: 'SENIOR',
    salary: {
      min: 100000,
      max: 140000,
      currency: 'CAD'
    }
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'DataVision AI',
    companyRelation: {
      name: 'DataVision AI',
      location: 'Calgary, Canada'
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    visaSponsorship: false,
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salary: {
      min: 90000,
      max: 130000,
      currency: 'CAD'
    }
  }
];

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  
  // Use client-side tRPC query
  const { data: apiJobs, isLoading, error } = api.jobs.getFeatured.useQuery({ limit: 6 });
  
  useEffect(() => {
    if (apiJobs && Array.isArray(apiJobs) && apiJobs.length > 0) {
      setFeaturedJobs(apiJobs);
    } else if (error || (!isLoading && (!apiJobs || apiJobs.length === 0))) {
      console.log('No featured jobs found in database, using fallback data');
      setFeaturedJobs(getFallbackJobs());
    }
  }, [apiJobs, isLoading, error]);

  return (
    <div className="bg-white">
      <RoleUpdateHandler />
      {/* Premium Hero Section */}
      <PremiumHero />

      {/* Premium Stats Section */}
      <PremiumStats />

      {/* Premium Features Section */}
      <PremiumFeatures />
      
      {/* Profile Completion Call-to-Action - Andela-inspired clean design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-medium mb-6 text-gray-900">Complete Your <span className="text-navy">Canadian Profile</span></h2>
              <p className="text-lg text-gray-600 mb-8">
                Stand out to top Canadian employers by completing your professional profile. 
                Showcase your skills and experience to get matched with the perfect job across Canada.
              </p>
              <div className="flex">
                <Link 
                  href="/profile"
                  className="inline-flex items-center bg-navy text-white font-medium px-6 py-3 rounded-md transition-colors hover:bg-navy/90"
                >
                  Complete Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative h-64 lg:h-96 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Canadian professionals" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section (Premium Style) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Canadian Job Opportunities
              </h2>
              <p className="text-gray-600">
                Discover top job openings from leading employers across major Canadian cities
              </p>
            </div>
            <Link 
              href="/jobs?location=Canada" 
              className="hidden md:inline-flex items-center text-navy hover:text-navy/90 font-medium"
            >
              View All Jobs
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* Canadian Job Market Benefits */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="premium-card shadow-md p-7 rounded-lg transition-all hover:scale-[1.025] overflow-hidden">
              <div className="relative h-32 bg-cover bg-center mb-4" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")'
              }}>
                <div className="absolute inset-0 bg-navy/30"></div>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                    Tech Hub Cities
                    <span className="bg-navy/10 text-navy ml-2 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>Major Tech Centers</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Toronto, Vancouver, Montreal</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Startups</span>
                  <span>•</span>
                  <span>Tech Giants</span>
                </div>
                <div className="text-gray-900 font-medium">
                  High demand for tech talent
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Competitive salaries
                </div>
              </div>
              <Link 
                href="/jobs?location=Toronto" 
                className="inline-flex items-center justify-center w-full bg-navy hover:bg-navy/90 text-white font-medium py-2.5 px-4 rounded-lg transition-all hover:shadow-lg"
              >
                Explore Toronto Jobs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            <div className="premium-card shadow-md p-7 rounded-lg transition-all hover:scale-[1.025] overflow-hidden">
              <div className="relative h-32 bg-cover bg-center mb-4" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1560814304-4f05b62af116?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")'
              }}>
                <div className="absolute inset-0 bg-navy/30"></div>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                    In-Demand Skills
                    <span className="bg-navy/10 text-navy ml-2 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Hot
                    </span>
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    <span>High-Growth Fields</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="text-sm">1000+ Active Job Listings</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Web Dev</span>
                  <span>•</span>
                  <span>Data Science</span>
                </div>
                <div className="text-gray-900 font-medium">
                  Skills-based matching
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Quick application process
                </div>
              </div>
              <Link 
                href="/jobs?location=Canada" 
                className="inline-flex items-center justify-center w-full bg-navy hover:bg-navy/90 text-white font-medium py-2.5 px-4 rounded-lg transition-all hover:shadow-lg"
              >
                Browse All Skills
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            <div className="premium-card shadow-md p-7 rounded-lg transition-all hover:scale-[1.025] overflow-hidden">
              <div className="relative h-32 bg-cover bg-center mb-4" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")'
              }}>
                <div className="absolute inset-0 bg-navy/30"></div>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                    Complete Your Profile
                    <span className="bg-navy/10 text-navy ml-2 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Boost
                    </span>
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Stand Out to Employers</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Verified Profile Status</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>CV Upload</span>
                  <span>•</span>
                  <span>Skills Assessment</span>
                </div>
                <div className="text-gray-900 font-medium">
                  Higher visibility to employers
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Takes only 5 minutes
                </div>
              </div>
              <Link 
                href="/profile" 
                className="inline-flex items-center justify-center w-full bg-navy hover:bg-navy/90 text-white font-medium py-2.5 px-4 rounded-lg transition-all hover:shadow-lg"
              >
                Complete Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
          
          {/* Mobile View All Jobs Button */}
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/jobs?location=Canada" 
              className="inline-flex items-center bg-navy hover:bg-navy/90 text-white font-medium px-6 py-3 rounded-lg"
            >
              View All Canadian Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Testimonials Section */}
      <PremiumTestimonials />

      {/* Premium How It Works Section */}
      <PremiumHowItWorks />
    </div>
  );
}