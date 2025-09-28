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
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
          job.premium ? 'border-gradient-to-r from-yellow-400 to-orange-500 border-2' : ''
        }`}
        onClick={handleCardClick}
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {getCompanyLogo() ? (
                <img 
                  src={getCompanyLogo()!} 
                  alt={getCompanyName()} 
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {job.title}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Building2 className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{getCompanyName()}</span>
                </div>
                {job.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {job.premium && (
                <Badge variant="outline" className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 text-yellow-800">
                  <Crown className="w-3 h-3" />
                  Premium
                </Badge>
              )}
              {job.featured && (
                <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 border-blue-300 text-blue-800">
                  <Star className="w-3 h-3" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Job Details */}
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {formatJobType(job.jobType)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatExperienceLevel(job.experienceLevel)}
              </Badge>
              {job.visaSponsorship && (
                <Badge variant="outline" className="flex items-center gap-1 bg-green-100 border-green-300 text-green-800">
                  <Users className="w-3 h-3" />
                  Visa Sponsorship
                </Badge>
              )}
            </div>

            {/* Salary */}
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>

            {/* Description Preview */}
            <div className="text-sm text-gray-600">
              {job.description ? (
                <p className="line-clamp-2">{job.description}</p>
              ) : (
                <p className="text-gray-400 italic">No description available</p>
              )}
            </div>

            {/* Premium Content Preview */}
            {job.premium && !hasPremiumAccess && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">Premium Job - Subscribe to view full details</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  This job includes additional benefits, detailed requirements, and direct employer contact.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/jobs/${job.id}`;
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
                
                <button
                  onClick={handleApplyClick}
                  className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                    job.premium && !hasPremiumAccess
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={job.premium && !hasPremiumAccess}
                >
                  {job.premium && !hasPremiumAccess ? (
                    <>
                      <Lock className="w-3 h-3" />
                      Subscribe to Apply
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3 h-3" />
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
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
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

