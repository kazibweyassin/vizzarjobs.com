"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { type Job, type Company } from "@prisma/client";
import { Badge } from "~/components/ui/premium-badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { DescriptionPreview } from "~/components/DescriptionPreview";
import {
  MapPin,
  DollarSign,
  Users,
  Clock,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle,
  Plane,
} from "lucide-react";
import { api } from "~/trpc/react";
import { getStatusLabel, getStatusColor } from "~/lib/applications";

interface JobCardProps {
  job: Job & {
    companyRelation: Company;
    _count?: {
      applications: number;
    };
  };
  /** Pre-fetched saved state (passed in from a parent that already has the list) */
  initialSaved?: boolean;
}

export function JobCard({ job, initialSaved = false }: JobCardProps) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // DB-backed toggle mutation
  const toggleSave = api.savedJobs.toggle.useMutation({
    onMutate: () => setSaved((prev) => !prev), // optimistic update
    onError: () => setSaved((prev) => !prev),   // rollback on error
  });

  // Application status from DB — only query when logged in
  const { data: appStatus } = api.applications.getApplicationStatus.useQuery(
    { jobId: job.id },
    { enabled: !!session?.user, staleTime: 60_000 }
  );

  const handleSaveToggle = () => {
    if (!session?.user) {
      window.location.href = `/auth/signin?callbackUrl=/jobs/${job.id}`;
      return;
    }
    toggleSave.mutate({ jobId: job.id });
  };

  const handleShare = () => setShowShareMenu((v) => !v);

  const copyJobLink = () => {
    void navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`);
    setShowShareMenu(false);
  };

  const shareViaEmail = () => {
    const companyName = job.companyRelation?.name ?? "Company";
    const subject = encodeURIComponent(`Job Opportunity: ${job.title} at ${companyName}`);
    const body = encodeURIComponent(
      `Check out this job on VizzarJobs:\n\n${job.title} at ${companyName}\n\n${window.location.origin}/jobs/${job.id}`
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
      case "FULL_TIME": return "Full Time";
      case "CONTRACT":  return "Contract";
      case "INTERNSHIP": return "Internship";
      default: return jobType;
    }
  };

  const formatExperienceLevel = (level: string) => {
    switch (level) {
      case "JUNIOR": return "Junior";
      case "MID":    return "Mid Level";
      case "SENIOR": return "Senior";
      default: return level;
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "JUNIOR": return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "MID":    return "bg-[#0F2C4C]/8 text-[#0F2C4C] border-[#0F2C4C]/20 hover:bg-[#0F2C4C]/15";
      case "SENIOR": return "bg-[#0F2C4C]/15 text-[#0F2C4C] border-[#0F2C4C]/25 hover:bg-[#0F2C4C]/20";
      default:       return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TIME":  return "bg-[#0F2C4C]/8 text-[#0F2C4C] border-[#0F2C4C]/20 hover:bg-[#0F2C4C]/15";
      case "CONTRACT":   return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
      case "INTERNSHIP": return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      default:           return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#0F2C4C]/30">
      <CardHeader className="pb-3">
        {job.visaSponsorship && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Plane className="w-3 h-3" />
              Visa Sponsored
            </span>
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#0F2C4C] transition-colors">
              <Link href={`/jobs/${job.id}`} className="hover:underline">
                {job.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-medium text-gray-600">
                {job.companyRelation?.name ?? "Company"}
              </p>
              {appStatus?.status && (
                <Badge
                  variant="outline"
                  className={`border-none text-xs ${getStatusColor(appStatus.status as any)}`}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {getStatusLabel(appStatus.status as any)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}, {job.country}</span>
            </div>
            <Badge variant="outline" className={getJobTypeColor(job.jobType ?? "")}>
              {formatJobType(job.jobType ?? "")}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
            <Badge variant="outline" className={getExperienceColor(job.experienceLevel ?? "")}>
              {formatExperienceLevel(job.experienceLevel ?? "")}
            </Badge>
          </div>

          {job.techStack && job.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.techStack.slice(0, 4).map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100">
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

          <DescriptionPreview content={job.description ?? ""} maxLines={2} className="text-sm text-gray-600" />
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
              <button
                onClick={handleSaveToggle}
                disabled={toggleSave.isPending}
                className={`p-1.5 rounded-full transition-colors ${
                  saved
                    ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
                aria-label={saved ? "Unsave job" : "Save job"}
              >
                <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
              </button>

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
                    <button onClick={copyJobLink} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">
                      Copy link
                    </button>
                    <button onClick={shareViaEmail} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">
                      Share via email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F2C4C] hover:bg-[#0F2C4C]/90 text-white text-xs font-semibold rounded-lg transition-all"
          >
            View Details
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default JobCard;
