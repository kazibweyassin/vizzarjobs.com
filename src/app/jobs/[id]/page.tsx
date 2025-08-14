import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
  Calendar
} from "lucide-react";
import { JobActions } from "~/components/JobActions";

interface JobPageProps {
  params: {
    id: string;
  };
}

export default async function JobPage({ params }: JobPageProps) {
  try {
    const job = await api.jobs.getById({ id: params.id });

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
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
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

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Tech Stack */}
              {job.techStack.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tech Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.techStack.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-50 text-gray-700 hover:bg-gray-100"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-center">Apply for this position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    {/* Job Actions component (client-side) */}
                    <JobActions jobId={job.id} applicationUrl={job.applicationUrl} />
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        You'll be redirected to the company's application page
                      </p>
                    </div>
                  </div>

                  {job.visaSponsorship && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                        <Award className="w-4 h-4" />
                        Visa Sponsorship Available
                      </div>
                      <p className="text-sm text-green-700">
                        This company offers visa sponsorship for qualified candidates.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Company Info */}
              {job.companyRelation && (
                <Card>
                  <CardHeader>
                    <CardTitle>About {job.companyRelation.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {job.companyRelation.logo && (
                      <div className="text-center">
                        <img
                          src={job.companyRelation.logo}
                          alt={`${job.companyRelation.name} logo`}
                          className="w-16 h-16 mx-auto rounded-lg object-contain"
                        />
                      </div>
                    )}
                    
                    {job.companyRelation.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {job.companyRelation.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      {job.companyRelation.industry && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{job.companyRelation.industry}</span>
                        </div>
                      )}
                      
                      {job.companyRelation.size && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{job.companyRelation.size} employees</span>
                        </div>
                      )}
                      
                      {job.companyRelation.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{job.companyRelation.location}</span>
                        </div>
                      )}
                      
                      {job.companyRelation.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <Link
                            href={job.companyRelation.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            Company Website
                          </Link>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/companies/${job.companyRelation.id}`}
                      className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View all jobs from {job.companyRelation.name}
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type:</span>
                    <span className="font-medium">{formatJobType(job.jobType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience Level:</span>
                    <span className="font-medium">{formatExperienceLevel(job.experienceLevel)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{job.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visa Sponsorship:</span>
                    <span className={`font-medium ${job.visaSponsorship ? 'text-green-600' : 'text-gray-500'}`}>
                      {job.visaSponsorship ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
