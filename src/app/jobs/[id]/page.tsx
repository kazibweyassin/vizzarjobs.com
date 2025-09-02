import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { JobViewTracker } from "~/components/analytics/JobViewTracker";
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  ExternalLink,
  Award,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowLeft,
  Globe,
  Calendar,
} from "lucide-react";
import { JobActions } from "~/components/JobActions";

// Updated Props type for Next.js 15
type Props = {
  params: { id: string }; // Awaiting `params` directly
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function JobPage({ params, searchParams }: Props) {
  try {
    // Destructure `params` directly
    const { id } = params;

    // Fetch job data using the id
    const job = await api.jobs.getById({ id });

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

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Analytics tracking - invisible component */}
        <JobViewTracker jobId={job.id} jobTitle={job.title} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                        <Building2 className="w-5 h-5" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}, {job.country}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        {job._count && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{job._count.applications} applicants</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {job.visaSponsorship && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-medium text-sm px-3 py-1">
                        <Award className="w-4 h-4 mr-1" />
                        Visa Sponsored
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {formatJobType(job.jobType)}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {formatExperienceLevel(job.experienceLevel)}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              {/* Remaining components */}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}