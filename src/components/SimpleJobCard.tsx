"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { formatSalary } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Plane, 
  Building2,
  ArrowRight
} from "lucide-react";

interface SimpleJobCardProps {
  job: any; // Using any type temporarily to handle different data structures
  index?: number;
}

export function SimpleJobCard({ job, index = 0 }: SimpleJobCardProps) {
  // Handle either companyRelation or direct company name
  const companyName = job.companyRelation?.name || job.company || "Unknown Company";
  const companyLocation = job.companyRelation?.location || job.location || "Remote";
  const companyLogo = job.companyRelation?.logo || null;
  
  // Format job type if present
  const formatJobType = (jobType?: string | null) => {
    if (!jobType) return "";
    
    switch (jobType) {
      case "FULL_TIME": return "Full Time";
      case "CONTRACT": return "Contract";
      case "INTERNSHIP": return "Internship";
      default: return jobType;
    }
  };
  
  // Format experience level if present
  const formatExperienceLevel = (level?: string | null) => {
    if (!level) return "";
    
    switch (level) {
      case "JUNIOR": return "Junior";
      case "MID": return "Mid Level";
      case "SENIOR": return "Senior";
      default: return level;
    }
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden transition-all duration-200 border border-gray-200 hover:border-[#0F2C4C]/30 hover:shadow-md">
      <Link href={`/jobs/${job.id}`} className="block p-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {companyLogo ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={companyLogo}
                    alt={companyName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-[#0F2C4C]/8 flex items-center justify-center border border-[#0F2C4C]/15">
                  <Building2 className="w-8 h-8 text-[#0F2C4C]/60" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1 hover:text-[#0F2C4C] transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600">{companyName}</p>
              {companyLocation && (
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location || companyLocation}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-right text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </span>
            </div>
            {job.visaSponsorship && (
              <Badge className="inline-flex items-center gap-1 bg-amber-500 text-white border-0 hover:bg-amber-600">
                <Plane className="w-3 h-3" />
                <span>Visa Sponsored</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {job.jobType && (
              <Badge variant="outline" className="text-gray-700">
                {formatJobType(job.jobType)}
              </Badge>
            )}
            {job.experienceLevel && (
              <Badge variant="outline" className="text-gray-700">
                {formatExperienceLevel(job.experienceLevel)}
              </Badge>
            )}
            {job.locationType && (
              <Badge variant="outline" className="text-gray-700">
                {job.locationType}
              </Badge>
            )}
          </div>

          <div className="mt-3 flex justify-between items-center">
            {(job.salary || job.salaryMax) && (
              <div className="font-semibold text-gray-900">
                {formatSalary(job.salary, job.salaryMax)}
              </div>
            )}
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F2C4C] text-white text-xs font-semibold rounded-lg hover:bg-[#0F2C4C]/90 transition-all group">
              View Details
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
