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
  User,
  Brain,
  Code,
  Database,
  Shield,
  Rocket,
  ChevronRight,
  Play
} from "lucide-react";
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

// Helper function to get fallback AI/ML jobs
const getFallbackJobs = (): Job[] => [
  {
    id: '1',
    title: 'Senior Machine Learning Engineer',
    company: 'AI Innovations Inc',
    companyRelation: {
      name: 'AI Innovations Inc',
      location: 'Toronto, Canada'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salary: {
      min: 120000,
      max: 180000,
      currency: 'CAD'
    }
  },
  {
    id: '2',
    title: 'Computer Vision Specialist',
    company: 'VisionTech Solutions',
    companyRelation: {
      name: 'VisionTech Solutions',
      location: 'Vancouver, Canada'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salary: {
      min: 100000,
      max: 150000,
      currency: 'CAD'
    }
  },
  {
    id: '3',
    title: 'NLP Research Scientist',
    company: 'LanguageAI Corp',
    companyRelation: {
      name: 'LanguageAI Corp',
      location: 'Montreal, Canada'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salary: {
      min: 110000,
      max: 160000,
      currency: 'CAD'
    }
  },
  {
    id: '4',
    title: 'AI Product Manager',
    company: 'SmartTech Ventures',
    companyRelation: {
      name: 'SmartTech Ventures',
      location: 'Ottawa, Canada'
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salary: {
      min: 95000,
      max: 140000,
      currency: 'CAD'
    }
  },
  {
    id: '5',
    title: 'Deep Learning Engineer',
    company: 'NeuralNet Systems',
    companyRelation: {
      name: 'NeuralNet Systems',
      location: 'Toronto, Canada'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    visaSponsorship: true,
    jobType: 'CONTRACT',
    experienceLevel: 'SENIOR',
    salary: {
      min: 130000,
      max: 190000,
      currency: 'CAD'
    }
  },
  {
    id: '6',
    title: 'Data Science Lead',
    company: 'AnalyticsPro Canada',
    companyRelation: {
      name: 'AnalyticsPro Canada',
      location: 'Calgary, Canada'
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    visaSponsorship: true,
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salary: {
      min: 115000,
      max: 170000,
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
      setFeaturedJobs(apiJobs as Job[]);
    } else if (error || (!isLoading && (!apiJobs || apiJobs.length === 0))) {
      console.log('No featured jobs found in database, using fallback data');
      setFeaturedJobs(getFallbackJobs());
    }
  }, [apiJobs, isLoading, error]);

  return (
    <div className="bg-white">
      <RoleUpdateHandler />
      
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    <Brain className="w-4 h-4 mr-2" />
                    AI/ML Talent Platform
                  </div>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Connect AI/ML Talent to
                    <span className="text-blue-600"> Canadian</span> Companies
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                    Join Canada's premier AI/ML talent platform. Connect with leading Canadian companies 
                    offering competitive salaries, visa sponsorship, and world-class opportunities.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/career-assessment">
                    <button className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                      <Zap className="w-5 h-5 mr-2" />
                      Take Career Assessment
                    </button>
                  </Link>
                  
                  <Link href="/talent-pool/register">
                    <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors">
                      <User className="w-5 h-5 mr-2" />
                      Join Talent Pool
                    </button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">200+</div>
                    <div className="text-sm text-gray-600">AI/ML Professionals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">25+</div>
                    <div className="text-sm text-gray-600">Canadian Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative">
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="AI/ML professionals working" 
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Machine Learning</div>
                      <div className="text-xs text-gray-600">High Demand</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Data Science</div>
                      <div className="text-xs text-gray-600">Growing Field</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose VizzarJobs for AI/ML Careers?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in connecting AI/ML professionals with Canadian companies 
              that value innovation and offer exceptional career opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visa Sponsorship</h3>
              <p className="text-gray-600">
                All our partner companies offer comprehensive visa sponsorship and 
                relocation support for international AI/ML talent.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Competitive Salaries</h3>
              <p className="text-gray-600">
                Access to high-paying AI/ML positions with salaries ranging from 
                $100K to $200K+ CAD across major Canadian cities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Growth</h3>
              <p className="text-gray-600">
                Join innovative companies at the forefront of AI/ML development 
                with clear career progression paths and learning opportunities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI-powered matching system connects you with opportunities 
                that align with your skills, experience, and career goals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Network</h3>
              <p className="text-gray-600">
                Connect with a community of AI/ML professionals and industry 
                experts who can help accelerate your career growth.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Assurance</h3>
              <p className="text-gray-600">
                All companies are vetted for their commitment to AI/ML innovation 
                and their track record of supporting international talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured AI/ML Jobs in Canada
              </h2>
              <p className="text-xl text-gray-600">
                Discover top AI/ML opportunities from leading Canadian companies
              </p>
            </div>
            <Link 
              href="/jobs?location=Canada&category=AI-ML" 
              className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Jobs
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.slice(0, 6).map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {typeof job.company === 'string' ? job.company : job.company?.name || 'Company'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {job.companyRelation?.location || 'Canada'}
                      </span>
                    </div>
                  </div>
                  {job.visaSponsorship && (
                    <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Visa Sponsorship
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{formatJobType(job.jobType || 'FULL_TIME')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    <span>{formatExperienceLevel(job.experienceLevel || 'MID')}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{getRelativeTime(job.createdAt)}</span>
                  </div>
                </div>

                <Link 
                  href={`/jobs/${job.id}`}
                  className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
          
          {/* Mobile View All Jobs Button */}
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/jobs?location=Canada&category=AI-ML" 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              View All AI/ML Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your AI/ML Career in Canada?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of AI/ML professionals who have found their dream jobs 
              through VizzarJobs. Take our career assessment to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/career-assessment">
                <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  <Play className="w-5 h-5 mr-2" />
                  Start Career Assessment
                </button>
              </Link>
              <Link href="/talent-pool/register">
                <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                  <User className="w-5 h-5 mr-2" />
                  Join Talent Pool
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}