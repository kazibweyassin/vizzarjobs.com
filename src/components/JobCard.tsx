"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { type Job, type Company } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { 
  MapPin, 
  DollarSign, 
  Users, 
  Clock, 
  ExternalLink,
  Award,
  Bookmark,
  Share2,
  CheckCircle
} from "lucide-react";
import { saveJob, removeJob, isJobSaved } from "~/lib/savedJobs";
import { hasApplied, getApplicationStatus, getStatusLabel, getStatusColor } from "~/lib/applications";

interface JobCardProps {
  job: Job & {
    companyRelation: Company;
    _count?: {
      applications: number;
    };
  };
}

export function JobCard({ job }: JobCardProps) {
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  
  // Check if the job is saved and application status on component mount
  useEffect(() => {
    setSaved(isJobSaved(job.id));
    if (hasApplied(job.id)) {
      const status = getApplicationStatus(job.id);
      setApplicationStatus(status);
    }
  }, [job.id]);
  
  const handleSaveToggle = () => {
    if (saved) {
      removeJob(job.id);
    } else {
      saveJob(job.id);
    }
    setSaved(!saved);
  };
  
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };
  
  const copyJobLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`);
    setShowShareMenu(false);
    // You could add a toast notification here
  };
  
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Job Opportunity: ${job.title} at ${job.company}`);
    const body = encodeURIComponent(
      `Check out this job on VizzarJobs:\n\n` +
      `${job.title} at ${job.company}\n\n` +
      `${window.location.origin}/jobs/${job.id}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setShowShareMenu(false);
  };
  
  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return "Salary not specified";
  };

  const formatJobType = (jobType: string) => {
    switch (jobType) {
      case "FULL_TIME":
        return "Full Time";
      case "CONTRACT":
        return "Contract";
      case "INTERNSHIP":
        return "Internship";
      default:
        return jobType;
    }
  };

  const formatExperienceLevel = (level: string) => {
    switch (level) {
      case "JUNIOR":
        return "Junior";
      case "MID":
        return "Mid Level";
      case "SENIOR":
        return "Senior";
      default:
        return level;
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "JUNIOR":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "MID":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "SENIOR":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "CONTRACT":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "INTERNSHIP":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              <Link href={`/jobs/${job.id}`} className="hover:underline">
                {job.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-medium text-gray-600">{job.company}</p>
              {applicationStatus && (
                <Badge variant="outline" className={`border-none text-xs ${getStatusColor(applicationStatus as any)}`}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {getStatusLabel(applicationStatus as any)}
                </Badge>
              )}
            </div>
          </div>
          {job.visaSponsorship && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-medium">
              <Award className="w-3 h-3 mr-1" />
              Visa Sponsored
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          {/* Location and Job Type */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}, {job.country}</span>
            </div>
            <Badge variant="outline" className={getJobTypeColor(job.jobType)}>
              {formatJobType(job.jobType)}
            </Badge>
          </div>

          {/* Salary and Experience Level */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
            <Badge variant="outline" className={getExperienceColor(job.experienceLevel)}>
              {formatExperienceLevel(job.experienceLevel)}
            </Badge>
          </div>

          {/* Tech Stack */}
          {job.techStack && job.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.techStack.slice(0, 4).map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  {tech}
                </Badge>
              ))}
              {job.techStack.length > 4 && (
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                  +{job.techStack.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Job Description Preview */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              {job._count && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{job._count.applications} applicants</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Save button */}
              <button
                onClick={handleSaveToggle}
                className={`p-1.5 rounded-full transition-colors ${
                  saved ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={saved ? "Unsave job" : "Save job"}
              >
                <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
              </button>
              
              {/* Share button with dropdown */}
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Share job"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                
                {showShareMenu && (
                  <div className="absolute bottom-full mb-2 right-0 bg-white shadow-lg rounded-md border border-gray-200 py-1 w-40 z-10">
                    <button
                      onClick={copyJobLink}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      Copy link
                    </button>
                    <button
                      onClick={shareViaEmail}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      Share via email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Link 
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View Details
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
