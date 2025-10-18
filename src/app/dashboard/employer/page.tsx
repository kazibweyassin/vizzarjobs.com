"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Briefcase, 
  Building2, 
  Clock,
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2, 
  Plus,
  Users,
  Settings,
  MapPin,
  BarChart3,
  Star,
  ArrowRight,
  Eye,
  Shield
} from "lucide-react";

export default function EmployerDashboardPage() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"jobs" | "company" | "settings">("jobs");

  // Redirect if not logged in
  if (status === 'unauthenticated') {
    router.push('/auth/signin?callbackUrl=/dashboard/employer');
    return null;
  }

  // Fetch employer/company data
  const { data: userData, isLoading, error } = api.users.getProfile.useQuery(undefined, {
    enabled: !!sessionData?.user,
    retry: false,
  });

  // Fetch jobs posted by the employer
  const jobsQuery = api.jobs.getByCompany.useQuery(
    { companyId: userData?.employee?.company?.id || "" },
    { enabled: !!userData?.employee?.company?.id }
  );

  if (isLoading || status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  // If user is not an employer or doesn't have company data, redirect to onboarding
  if (!userData?.employee?.company && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Your Employer Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let's get your company profile set up so you can start attracting top talent and managing your recruitment process.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Company Profile Setup</h2>
                    <p className="text-blue-100">Required to access employer features</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left Column - Benefits */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Job Posting Management</h4>
                        <p className="text-sm text-gray-600">Create, edit, and manage your job postings with rich formatting</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Application Tracking</h4>
                        <p className="text-sm text-gray-600">View and manage candidate applications in real-time</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Analytics & Insights</h4>
                        <p className="text-sm text-gray-600">Track job performance and recruitment metrics</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Star className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Premium Features</h4>
                        <p className="text-sm text-gray-600">Access featured job listings and advanced tools</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Setup Process */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup Process:</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Company Information</h4>
                        <p className="text-sm text-gray-600">Add your company name, description, and logo</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Contact Details</h4>
                        <p className="text-sm text-gray-600">Provide contact information and website</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Verification</h4>
                        <p className="text-sm text-gray-600">Get verified to unlock all features</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">⚡</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Quick & Easy</h4>
                        <p className="text-sm text-blue-700">Setup takes less than 5 minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => router.push('/employer-onboarding')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
                  <Building2 className="w-5 h-5 mr-2" />
          Create Company Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                
                <button 
                  onClick={() => router.push('/jobs')}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Browse Jobs First
        </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>5-minute setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>500+ companies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const company = userData?.employee?.company;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your company and job postings
          </p>
        </div>

        {/* Company Status Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                {company?.logo ? (
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-gray-400 border border-gray-200 rounded-md p-2" />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{company?.name}</h2>
                  <div className="flex items-center mt-1">
                    {company?.verified ? (
                      <Badge variant="success" className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Verified</span>
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Pending Verification</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link 
                  href="/post-job" 
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    company?.verified
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => !company?.verified && e.preventDefault()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Post a Job
                </Link>
                <Link 
                  href="/dashboard/employer/jobs"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Briefcase className="h-4 w-4 mr-1" />
                  Manage Jobs
                </Link>
              </div>
            </div>

            {!company?.verified && (
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your company is pending verification. You'll be able to post jobs once verified.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "jobs"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Briefcase className="inline-block h-5 w-5 mr-2" />
              Jobs
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "company"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Building2 className="inline-block h-5 w-5 mr-2" />
              Company Profile
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Settings className="inline-block h-5 w-5 mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "jobs" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Job Listings</h2>
              <Link
                href="/post-job"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  company?.verified
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={(e) => !company?.verified && e.preventDefault()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Post a Job
              </Link>
            </div>

            {jobsQuery.isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : jobsQuery.error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Failed to load job listings
              </div>
            ) : jobsQuery.data?.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs posted yet</h3>
                <p className="text-gray-500 mb-4">
                  Get started by creating your first job posting
                </p>
                <Link
                  href="/post-job"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    company?.verified
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => !company?.verified && e.preventDefault()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Post a Job
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jobsQuery.data?.map((job) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                        <Badge variant="outline">
                          {job.jobType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location || "Remote"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {job.description?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {job._count?.applications || 0} {job._count?.applications === 1 ? 'application' : 'applications'}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t bg-gray-50 flex justify-between">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/jobs/${job.id}/applications`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Applications
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "company" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Company Profile</h2>
              <Link
                href="/employer-onboarding"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </Link>
            </div>

            <Card>
              <CardContent className="divide-y divide-gray-200">
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                  <p className="mt-1">{company?.name}</p>
                </div>
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{company?.description || "No description provided"}</p>
                </div>
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-500">Website</h3>
                  <p className="mt-1">
                    {company?.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {company.website}
                      </a>
                    ) : (
                      "No website provided"
                    )}
                  </p>
                </div>
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                  <p className="mt-1">{company?.industry || "Not specified"}</p>
                </div>
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-500">Company Size</h3>
                  <p className="mt-1">{company?.size || "Not specified"}</p>
                </div>
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1">{company?.location || "Not specified"}</p>
                </div>
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                  <div className="mt-1">
                    {company?.verified ? (
                      <Badge variant="success" className="flex items-center w-fit space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Verified</span>
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="flex items-center w-fit space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{company?.verificationStatus}</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Account Settings</h2>
            </div>

            <Card>
              <CardContent className="py-6">
                <p className="text-gray-600">Account settings will be available soon.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}