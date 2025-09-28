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
import { PremiumPaywallWrapper } from "~/components/PremiumPaywallWrapper";

// Updated Props type for Next.js 15
type Props = {
  params: Promise<{ id: string }>; // Awaiting `params` directly
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function JobPage({ params, searchParams }: Props) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params;

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
            <PremiumPaywallWrapper 
              jobTitle={job.title}
              companyName={typeof job.company === 'object' && job.company?.name 
                ? job.company.name 
                : typeof job.company === 'string' 
                  ? job.company 
                  : "Company"}
              isPremium={job.premium || false}
            >
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
                        <span className="font-medium">
                          {typeof job.company === 'object' && job.company?.name 
                            ? job.company.name 
                            : typeof job.company === 'string' 
                              ? job.company 
                              : "Company"}
                        </span>
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
                      {formatJobType(job.jobType || "FULL_TIME")}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {formatExperienceLevel(job.experienceLevel || "MID")}
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
                  <CardTitle className="text-xl font-semibold">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.description || "No description provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Compensation & Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Compensation & Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Salary Range</h4>
                          <p className="text-gray-600">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Employment Type</h4>
                          <p className="text-gray-600">{formatJobType(job.jobType || "FULL_TIME")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Experience Level</h4>
                          <p className="text-gray-600">{formatExperienceLevel(job.experienceLevel || "MID")}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Location</h4>
                          <p className="text-gray-600">
                            {job.location && job.country 
                              ? `${job.location}, ${job.country}`
                              : job.location || job.country || "Not specified"
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Remote Work</h4>
                          <p className="text-gray-600">{job.remote ? "Remote friendly" : "On-site required"}</p>
                        </div>
                      </div>
                      
                      {job.visaSponsorship && (
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-emerald-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Visa Sponsorship</h4>
                            <p className="text-gray-600">Available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">What We're Looking For</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Required qualifications and experience for this position
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                          </div>
                          <span className="text-gray-700 leading-relaxed">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Tech Stack */}
              {job.techStack && job.techStack.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Technologies & Tools</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Technologies you'll work with in this role
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {job.techStack.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Required Skills</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Skills and competencies needed for this position
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Application Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">How to Apply</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.applicationUrl ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <ExternalLink className="w-5 h-5 text-green-600" />
                          <h4 className="font-medium text-green-900">External Application</h4>
                        </div>
                        <p className="text-green-700 text-sm mb-3">
                          This position requires applying through the company's external application system.
                        </p>
                        <a
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Apply on Company Website
                        </a>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-medium text-yellow-900">Application Method</h4>
                        </div>
                        <p className="text-yellow-700 text-sm">
                          Application details not provided. Please contact the company directly for application instructions.
                        </p>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Application Tips:</p>
                      <ul className="space-y-1 text-gray-500">
                        <li>• Tailor your resume to highlight relevant experience</li>
                        <li>• Include a cover letter if requested</li>
                        <li>• Prepare for technical interviews if applicable</li>
                        <li>• Research the company before applying</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Job Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Applicants</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {job._count?.applications || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Posted</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Days ago</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  
                  {job.featured && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">Featured</span>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Yes
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Apply Button */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ready to Apply?
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {job.applicationUrl 
                          ? "Click below to apply through the company's website"
                          : "Contact the company directly for application instructions"
                        }
                      </p>
                    </div>
                    
                    {job.applicationUrl ? (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apply Now
                      </a>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-3">
                          Application URL not provided
                        </p>
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
                        >
                          Apply Now
                        </button>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {job.applicationUrl 
                          ? "You will be redirected to the company's application page"
                          : "Please contact the company for application details"
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information */}
              {typeof job.company === 'object' && job.company && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{job.company.name}</span>
                    </div>
                    
                    {job.company.description && (
                      <p className="text-sm text-gray-600">
                        {job.company.description}
                      </p>
                    )}
                    
                    {job.company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a
                          href={job.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    
                    {job.company.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{job.company.location}</span>
                      </div>
                    )}
                    
                    {job.company.industry && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{job.company.industry}</span>
                      </div>
                    )}
                    
                    {job.company.size && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{job.company.size}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Job Actions */}
              <JobActions jobId={job.id} />
              </div>
            </PremiumPaywallWrapper>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}