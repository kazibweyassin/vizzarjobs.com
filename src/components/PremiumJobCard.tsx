"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign,
  Briefcase,
  Users,
  Star,
  Lock,
  Crown,
  Eye,
  ExternalLink
} from "lucide-react";

interface PremiumJobCardProps {
  job: {
    id: string;
    title: string;
    company?: string | {
      id: string;
      name: string;
      location: string | null;
      logo?: string | null;
      [key: string]: any;
    };
    companyRelation?: {
      id: string;
      name: string;
      location: string | null;
      logo?: string | null;
      [key: string]: any;
    };
    location?: string | null;
    country?: string | null;
    jobType?: string | null;
    experienceLevel?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    visaSponsorship?: boolean;
    premium?: boolean;
    featured?: boolean;
    createdAt: Date;
    description?: string | null;
    requirements?: string[];
    skills?: string[];
    techStack?: string[];
    applicationUrl?: string | null;
  };
  index?: number;
}

export function PremiumJobCard({ job, index = 0 }: PremiumJobCardProps) {
  const { data: session } = useSession();
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Check if user has premium access
  const { data: hasPremiumAccess, isLoading: premiumLoading } = api.subscriptions.hasPremiumAccess.useQuery(
    undefined,
    { enabled: !!session?.user }
  );

  const formatJobType = (type: string | null | undefined) => {
    if (!type) return "Full-time";
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatExperienceLevel = (level: string | null | undefined) => {
    if (!level) return "Mid-level";
    return level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return "Salary not specified";
  };

  const getCompanyName = () => {
    if (typeof job.company === 'string') return job.company;
    if (job.company && typeof job.company === 'object') return job.company.name;
    if (job.companyRelation) return job.companyRelation.name;
    return "Company not specified";
  };

  const getCompanyLogo = () => {
    if (job.company && typeof job.company === 'object') return job.company.logo;
    if (job.companyRelation) return job.companyRelation.logo;
    return null;
  };

  const handleCardClick = () => {
    if (job.premium && !hasPremiumAccess) {
      setShowPaywall(true);
      return;
    }
    // Navigate to job details
    window.location.href = `/jobs/${job.id}`;
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (job.premium && !hasPremiumAccess) {
      setShowPaywall(true);
      return;
    }
    
    // Handle application logic here
    if (job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
    } else {
      // Navigate to application page
      window.location.href = `/jobs/${job.id}/apply`;
    }
  };

  return (
    <>
      <Card 
        className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer border border-white/20 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:scale-[1.02] hover:-translate-y-1 ${
          job.premium ? 'ring-2 ring-gradient-to-r from-yellow-400 to-orange-500' : ''
        }`}
        onClick={handleCardClick}
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {getCompanyLogo() ? (
                <img 
                  src={getCompanyLogo()!} 
                  alt={getCompanyName()} 
                  className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600 flex items-center justify-center border border-white/20 shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </CardTitle>
                <div className="flex items-center text-sm text-slate-600 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                    <Building2 className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="truncate font-medium">{getCompanyName()}</span>
                </div>
                {job.location && (
                  <div className="flex items-center text-sm text-slate-500">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                      <MapPin className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="truncate">{job.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {job.premium && (
                <Badge className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                  <Crown className="w-4 h-4" />
                  Premium
                </Badge>
              )}
              {job.featured && (
                <Badge className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg">
                  <Star className="w-4 h-4" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Job Details */}
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                <Briefcase className="w-4 h-4" />
                {formatJobType(job.jobType)}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                <Users className="w-4 h-4" />
                {formatExperienceLevel(job.experienceLevel)}
              </div>
              {job.visaSponsorship && (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                  <Users className="w-4 h-4" />
                  Visa Sponsorship
                </div>
              )}
            </div>

            {/* Salary */}
            <div className="flex items-center text-sm text-slate-600">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold">{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>

            {/* Description Preview */}
            <div className="text-sm text-slate-600">
              {job.description ? (
                <p className="line-clamp-2 leading-relaxed">{job.description}</p>
              ) : (
                <p className="text-slate-400 italic">No description available</p>
              )}
            </div>

            {/* Premium Content Preview */}
            {job.premium && !hasPremiumAccess && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-3 text-sm text-yellow-800 mb-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">Premium Job - Subscribe to view full details</span>
                </div>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  This job includes additional benefits, detailed requirements, and direct employer contact.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center text-xs text-slate-500">
                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center mr-2">
                  <Clock className="w-3 h-3" />
                </div>
                <span className="font-medium">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/jobs/${job.id}`;
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                
                <button
                  onClick={handleApplyClick}
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                    job.premium && !hasPremiumAccess
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  {job.premium && !hasPremiumAccess ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Unlock Job
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Apply Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Job Access Required
              </h3>
              
              <p className="text-gray-600 mb-6">
                This is a premium job listing. Subscribe to VizzarJobs Premium to view full details and apply.
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  View Premium Plans
                </Link>
                
                <button
                  onClick={() => setShowPaywall(false)}
                  className="block w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


