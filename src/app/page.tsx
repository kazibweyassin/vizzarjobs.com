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
  Target
} from "lucide-react";
import { HeroSearch } from "~/components/HeroSearch";

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Next
              <span className="text-blue-400"> Tech Role</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-300 leading-relaxed">
              Connecting African tech talent with global opportunities. 
              Join thousands of developers building careers worldwide.
            </p>
            
            {/* Enhanced Search Component */}
            <div className="max-w-3xl mx-auto mb-12">
              <HeroSearch />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-white">2,500+</div>
                <div className="text-slate-400">Active Jobs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">15K+</div>
                <div className="text-slate-400">Developers</div>
              </div>
              <div className="hidden md:block">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-slate-400">Companies</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Jobs
              </h2>
              <p className="text-gray-600">
                Hand-picked opportunities from top companies
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
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>
                        {job.companyRelation?.name || job.company || "Company"}
                      </span>
                    </div>
                  </div>
                  {job.visaSponsorship && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      Visa
                    </span>
                  )}
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
                  className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
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
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
            >
              View All Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-8">
              Trusted by professionals at
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
              {/* Clean text-based logos */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">Google</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">Microsoft</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">Meta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">Amazon</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">Shopify</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">Netflix</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Why Choose VizzarJobs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're built specifically for African developers seeking global opportunities
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Global Opportunities</h3>
              <p className="text-gray-600">Access visa-sponsored roles from companies worldwide actively hiring African talent</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Curated Matches</h3>
              <p className="text-gray-600">Smart filtering connects you with roles that match your skills and career goals</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Fast Applications</h3>
              <p className="text-gray-600">Apply to multiple positions with one profile and track your progress in real-time</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start your global tech career in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Build a comprehensive profile showcasing your skills, experience, and career preferences
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Discover & Apply</h3>
              <p className="text-gray-600">
                Browse curated opportunities and apply directly to companies offering visa sponsorship
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Hired</h3>
              <p className="text-gray-600">
                Interview with global companies and start your international tech career journey
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              African developers finding amazing opportunities worldwide
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Within 3 weeks of joining VizzarJobs, I had offers from two US companies. Now I'm working remotely for a Silicon Valley startup with full visa sponsorship."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  DO
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">David Okonkwo</h4>
                  <p className="text-sm text-gray-600">Senior Developer, Nigeria → USA</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The platform made it so easy to find companies specifically looking for international talent. I'm now based in Berlin working for an amazing fintech company."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  SA
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Sarah Adesanya</h4>
                  <p className="text-sm text-gray-600">Full Stack Developer, Ghana → Germany</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "As a self-taught developer, I thought international opportunities were out of reach. VizzarJobs proved me wrong - I'm now working for a top Canadian tech company."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  RM
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Robert Mensah</h4>
                  <p className="text-sm text-gray-600">Mobile Developer, Kenya → Canada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Global Tech Career?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of African developers who've found amazing opportunities worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/jobs"
              className="border border-slate-600 hover:border-slate-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}