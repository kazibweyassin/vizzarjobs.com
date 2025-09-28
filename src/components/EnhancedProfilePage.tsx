"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  User, 
  Building2, 
  Mail,
  Calendar,
  Save,
  Loader2,
  Briefcase,
  FileText,
  TrendingUp,
  MapPin,
  Globe,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Eye,
  Heart,
  Share2,
  Plus,
  Edit,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

type UserRole = "JOB_SEEKER" | "EMPLOYER" | "EMPLOYEE" | "ADMIN";

interface EnhancedProfilePageProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    profileComplete: boolean;
  };
}

export function EnhancedProfilePage({ user }: EnhancedProfilePageProps) {
  const { update } = useSession();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "settings">("overview");

  // Fetch user profile data
  const { data: userData, isLoading: userLoading } = api.users.getProfile.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  // Fetch user's applications (for job seekers)
  const { data: applications, isLoading: applicationsLoading } = api.applications.getMyApplications.useQuery(
    { limit: 10 },
    { enabled: user.role === "JOB_SEEKER" }
  );

  // Fetch user's posted jobs (for employers)
  const { data: postedJobs, isLoading: jobsLoading } = api.jobs.getByCompany.useQuery(
    { companyId: userData?.employee?.company?.id || "" },
    { enabled: user.role === "EMPLOYER" && !!userData?.employee?.company?.id }
  );

  const updateUserMutation = api.users.updateRole.useMutation({
    onSuccess: async (updatedUser: any) => {
      await update({
        user: {
          ...user,
          role: updatedUser.role,
          profileComplete: updatedUser.profileComplete,
        },
      });
      setIsUpdating(false);
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);
      setIsUpdating(false);
    },
  });

  const handleSave = async () => {
    if (selectedRole === user.role) return;

    setIsUpdating(true);
    updateUserMutation.mutate({
      userId: user.id,
      role: selectedRole,
      profileComplete: true,
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "JOB_SEEKER":
        return <User className="w-5 h-5" />;
      case "EMPLOYER":
        return <Building2 className="w-5 h-5" />;
      case "EMPLOYEE":
        return <Briefcase className="w-5 h-5" />;
      case "ADMIN":
        return <Settings className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "JOB_SEEKER":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "EMPLOYER":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "EMPLOYEE":
        return "bg-green-100 text-green-700 border-green-200";
      case "ADMIN":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name || "No name provided"}
                </h1>
                <Badge className={`${getRoleColor(user.role)} text-sm font-medium`}>
                  {getRoleIcon(user.role)}
                  <span className="ml-1">{user.role.replace('_', ' ')}</span>
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(userData?.createdAt || new Date())}</span>
                </div>
              </div>

              {/* Profile Completion Status */}
              <div className="mt-3">
                <Badge 
                  variant="outline" 
                  className={`${
                    user.profileComplete 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {user.profileComplete ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Profile Complete
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Profile Incomplete
                    </>
                  )}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "activity", label: "Activity", icon: TrendingUp },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Applications Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Applications</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {applications?.applications?.length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Jobs Posted Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Jobs Posted</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {postedJobs?.length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Views Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Views</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Jobs Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData?.jobSeekerProfile && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Title</label>
                        <p className="text-gray-900">{userData.jobSeekerProfile.title || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Skills</label>
                        <p className="text-gray-900">{userData.jobSeekerProfile.skills || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Desired Salary</label>
                        <p className="text-gray-900">{userData.jobSeekerProfile.desiredSalary || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <p className="text-gray-900">{userData.jobSeekerProfile.location || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Willing to Relocate</label>
                        <Badge variant="outline" className={userData.jobSeekerProfile.willingToRelocate ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                          {userData.jobSeekerProfile.willingToRelocate ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Visa Sponsorship Required</label>
                        <Badge variant="outline" className={userData.jobSeekerProfile.visaSponsorshipRequired ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                          {userData.jobSeekerProfile.visaSponsorshipRequired ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </>
                  )}

                  {userData?.employee && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Position</label>
                        <p className="text-gray-900">{userData.employee.position || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Department</label>
                        <p className="text-gray-900">{userData.employee.department || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Company</label>
                        <p className="text-gray-900">{userData.employee.company?.name || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Employment Type</label>
                        <p className="text-gray-900">{userData.employee.employmentType || "Not specified"}</p>
                      </div>
                    </>
                  )}

                  {!userData?.jobSeekerProfile && !userData?.employee && (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Complete your profile to see detailed information</p>
                      <Link href="/onboarding">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Complete Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applications?.applications && applications.applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.applications.slice(0, 5).map((application: any) => (
                        <div key={application.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Applied to {application.job.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(application.createdAt)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {application.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No recent activity</p>
                      <Link href="/jobs">
                        <Button variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Start Applying
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-8">
            {/* Applications History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Application History
                </CardTitle>
                <CardDescription>
                  Track all your job applications and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-600">Loading applications...</span>
                  </div>
                ) : applications?.applications && applications.applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.applications.map((application: any) => (
                      <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{application.job.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {application.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {typeof application.job.company === 'object' && application.job.company?.name 
                                ? application.job.company.name 
                                : "Company"}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {application.job.location || "Remote"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Applied {formatDate(application.createdAt)}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Job
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-6">Start applying to jobs to see your application history here</p>
                    <Link href="/jobs">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Browse Jobs
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Role Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Account Type
                </CardTitle>
                <CardDescription>
                  Choose your primary role on VizzarJobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Job Seeker Option */}
                  <button
                    onClick={() => setSelectedRole("JOB_SEEKER")}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                      selectedRole === "JOB_SEEKER"
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Job Seeker</h3>
                        <p className="text-sm text-gray-600">
                          Looking for visa-sponsored tech jobs
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            Find Jobs
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            Apply
                          </Badge>
                        </div>
                      </div>
                      {selectedRole === "JOB_SEEKER" && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Employer Option */}
                  <button
                    onClick={() => setSelectedRole("EMPLOYER")}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                      selectedRole === "EMPLOYER"
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Employer</h3>
                        <p className="text-sm text-gray-600">
                          Post jobs and hire talent
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            Post Jobs
                          </Badge>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                            Hire
                          </Badge>
                        </div>
                      </div>
                      {selectedRole === "EMPLOYER" && (
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {/* Save Button */}
                {selectedRole !== user.role && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Profile Completion
                </CardTitle>
                <CardDescription>
                  Complete your profile to get the most out of VizzarJobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Profile Status</span>
                    <Badge 
                      variant="outline" 
                      className={`${
                        user.profileComplete 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {user.profileComplete ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  
                  {!user.profileComplete && (
                    <div className="pt-4 border-t border-gray-200">
                      <Link href="/onboarding">
                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Complete Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
