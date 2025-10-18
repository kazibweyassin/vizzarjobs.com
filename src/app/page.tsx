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

// Helper function to get fallback jobs
const getFallbackJobs = (): Job[] => [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechFlow Solutions',
    companyRelation: {
      name: 'TechFlow Solutions',
      location: 'New York, USA'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salary: {
      min: 90000,
      max: 130000,
      currency: 'USD'
    }
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'CloudScale Inc',
    companyRelation: {
      name: 'CloudScale Inc',
      location: 'Remote'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salary: {
      min: 75000,
      max: 105000,
      currency: 'USD'
    }
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'InfraMax',
    companyRelation: {
      name: 'InfraMax',
      location: 'London, UK'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    visaSponsorship: false,
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR'
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'StartupHub',
    companyRelation: {
      name: 'StartupHub',
      location: 'Berlin, Germany'
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salary: {
      min: 60000,
      max: 85000,
      currency: 'EUR'
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
    visaSponsorship: true,
    jobType: 'CONTRACT',
    experienceLevel: 'SENIOR'
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'DataVision AI',
    companyRelation: {
      name: 'DataVision AI',
      location: 'San Francisco, USA'
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salary: {
      min: 110000,
      max: 150000,
      currency: 'USD'
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
      
      {/* Profile Creation Call-to-Action */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Global Talent Pool?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect with employers worldwide and get discovered for visa-sponsored opportunities. 
            Join thousands of professionals who have found their dream jobs through our platform.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/talent-pool/register"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:scale-105"
            >
              Join Talent Pool Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section (Premium Style) */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Join Our Global Talent Pool
              </h2>
              <p className="text-gray-600">
                Connect with employers worldwide and get discovered for visa-sponsored opportunities
              </p>
            </div>
            <Link 
              href="/talent-pool" 
              className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Join Talent Pool
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* Talent Pool Benefits */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="premium-card premium-shadow p-7 rounded-2xl transition-all hover:scale-[1.025] overflow-hidden">
              <div className="relative h-32 bg-cover bg-center mb-4" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")'
              }}>
                <div className="absolute inset-0 bg-blue-600/20"></div>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                    Global Opportunities
                    <span className="gold-badge ml-2 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Visa
                    </span>
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Worldwide Access</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">15+ Countries</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Visa Sponsorship</span>
                  <span>•</span>
                  <span>Relocation Support</span>
                </div>
                <div className="text-gray-900 font-medium">
                  Direct employer connections
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Immediate matching
                </div>
              </div>
              <Link 
                href="/talent-pool/register" 
                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all hover:shadow-lg"
              >
                Register Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            <div className="premium-card premium-shadow p-7 rounded-2xl transition-all hover:scale-[1.025] overflow-hidden">
              <div className="relative h-32 bg-cover bg-center mb-4" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")'
              }}>
                <div className="absolute inset-0 bg-blue-600/20"></div>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                    AI-Powered Matching
                    <span className="gold-badge ml-2 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Smart
                    </span>
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    <span>Precision Matching</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">500+ Active Candidates</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Skill Matching</span>
                  <span>•</span>
                  <span>Experience Level</span>
                </div>
                <div className="text-gray-900 font-medium">
                  Advanced algorithms
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  95% success rate
                </div>
              </div>
              <Link 
                href="/talent-pool/register" 
                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all hover:shadow-lg"
              >
                Get Matched
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            <div className="premium-card premium-shadow p-7 rounded-2xl transition-all hover:scale-[1.025] overflow-hidden">
              <div className="relative h-32 bg-cover bg-center mb-4" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")'
              }}>
                <div className="absolute inset-0 bg-blue-600/20"></div>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                    Career Growth
                    <span className="gold-badge ml-2 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Growth
                    </span>
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Professional Development</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-sm">Premium Opportunities</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Career Resources</span>
                  <span>•</span>
                  <span>Mentorship</span>
                </div>
                <div className="text-gray-900 font-medium">
                  Exclusive job alerts
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Priority consideration
                </div>
              </div>
              <Link 
                href="/talent-pool/register" 
                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all hover:shadow-lg"
              >
                Start Growing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
          
          {/* Mobile Join Button */}
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/talent-pool/register" 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl"
            >
              Join Talent Pool
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