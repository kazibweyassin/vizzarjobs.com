import Link from "next/link";
import { api } from "~/trpc/server";
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
  Sparkles
} from "lucide-react";
import { PremiumHero } from "~/components/PremiumHero";
import { PremiumStats } from "~/components/PremiumStats";
import { PremiumFeatures } from "~/components/PremiumFeatures";
import { PremiumTestimonials } from "~/components/PremiumTestimonials";
import { PremiumHowItWorks } from "~/components/PremiumHowItWorks";
import { PremiumCard } from "~/components/ui/premium-card";
import HomePageClient from "~/components/HomePageClient";

// Define proper TypeScript interfaces
interface Company {
  name: string;
  location: string;
}

interface Job {
  id: string;
  title: string;
  company?: string;
  companyRelation?: Company;
  createdAt: Date;
  visaSponsorship: boolean;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experienceLevel: 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR' | 'LEAD';
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

export default async function HomePage() {
  let featuredJobs: Job[] = [];
  
  try {
    const apiJobs = await api.jobs.getFeatured({ limit: 6 });
    console.log('Featured Jobs:', apiJobs);
   
    if (Array.isArray(apiJobs) && apiJobs.length > 0) {
      featuredJobs = apiJobs;
    }
   
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Enhanced fallback data with more realistic information
    
  // Store the content in a variable so we can wrap it with the client component
    featuredJobs = [
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
        experienceLevel: 'MID_LEVEL',
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
        experienceLevel: 'MID_LEVEL',
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
        experienceLevel: 'MID_LEVEL',
        salary: {
          min: 110000,
          max: 150000,
          currency: 'USD'
        }
      }
    ];
  }

  return (
    <div className="bg-white">
      {/* Premium Hero Section */}
      <PremiumHero />

      {/* Premium Stats Section */}
      <PremiumStats />

      {/* Premium Features Section */}
      <PremiumFeatures />

      {/* Featured Jobs Section (Premium Style) */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Elite Positions
              </h2>
              <p className="text-gray-600">
                Hand-picked, visa-sponsored opportunities from premium employers
              </p>
            </div>
            <Link 
              href="/jobs" 
              className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View all jobs
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <div key={job.id} className="premium-card premium-shadow p-7 rounded-2xl transition-all hover:scale-[1.025]">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                      {job.title}
                      {job.visaSponsorship && (
                        <span className="gold-badge ml-2 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Visa
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>
                        {job.companyRelation?.name || job.company || "Company"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Job Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.companyRelation?.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{formatJobType(job.jobType)}</span>
                    <span>•</span>
                    <span>{formatExperienceLevel(job.experienceLevel)}</span>
                  </div>
                  {job.salary && (
                    <div className="text-gray-900 font-medium">
                      {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                    </div>
                  )}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {getRelativeTime(job.createdAt)}
                  </div>
                </div>
                {/* Action Button */}
                <Link 
                  href={`/jobs/${job.id}`} 
                  className="inline-flex items-center justify-center w-full premium-gradient text-white font-medium py-2.5 px-4 rounded-xl transition-all hover:shadow-lg"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/jobs" 
              className="inline-flex items-center premium-gradient text-white font-medium px-6 py-3 rounded-xl"
            >
              View All Jobs
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