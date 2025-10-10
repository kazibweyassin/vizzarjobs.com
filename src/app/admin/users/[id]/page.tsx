"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { 
  ArrowLeft,
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  Building2,
  MapPin,
  Globe,
  FileText,
  Briefcase,
  Users,
  ExternalLink,
  Edit,
  Download
} from "lucide-react";
import Link from "next/link";

export default function AdminUserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch detailed user data
  const { data: userData, isLoading, error } = api.users.getUserById.useQuery(
    { userId },
    { enabled: !!userId }
  );

  // Verification mutations
  const verifyUser = api.users.verifyUser.useMutation({
    onSuccess: () => {
      // Refetch data after verification
      window.location.reload();
    }
  });

  const rejectUser = api.users.rejectUser.useMutation({
    onSuccess: () => {
      window.location.reload();
    }
  });

  const requestMoreInfo = api.users.requestMoreInfo.useMutation({
    onSuccess: () => {
      window.location.reload();
    }
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800 border-red-200";
      case "EMPLOYER": return "bg-blue-100 text-blue-800 border-blue-200";
      case "JOB_SEEKER": return "bg-green-100 text-green-800 border-green-200";
      case "EMPLOYEE": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      case "NEED_MORE_INFO": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const user = userData;

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name || 'No Name'}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
                <Badge className={getStatusColor(user.verificationStatus)}>
                  {user.verificationStatus}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Verification Actions */}
      {user.verificationStatus === "PENDING" && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">User Pending Verification</h3>
                <p className="text-yellow-700">This user is waiting for admin approval.</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => verifyUser.mutate({ userId: user.id })}
                  disabled={verifyUser.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {verifyUser.isPending ? "Approving..." : "Approve"}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => rejectUser.mutate({ userId: user.id })}
                  disabled={rejectUser.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {rejectUser.isPending ? "Rejecting..." : "Reject"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => requestMoreInfo.mutate({ userId: user.id })}
                  disabled={requestMoreInfo.isPending}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {requestMoreInfo.isPending ? "Requesting..." : "Request More Info"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Account Status</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.verificationStatus === "APPROVED" ? "Active" : "Pending"}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profile Complete</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.profileComplete ? "Yes" : "No"}
                    </p>
                  </div>
                  <User className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Premium Status</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.premium ? "Premium" : "Free"}
                    </p>
                  </div>
                  <Briefcase className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">User ID</label>
                  <p className="text-sm text-gray-600 font-mono">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Verification Status</label>
                  <Badge className={getStatusColor(user.verificationStatus)}>
                    {user.verificationStatus}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Joined</label>
                  <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-sm text-gray-600">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-600">{user.name || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <p className="text-sm text-gray-600">{user.bio || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-600">{user.location || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <p className="text-sm text-gray-600">
                    {user.website ? (
                      <Link href={user.website} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                        {user.website}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">GitHub</label>
                  <p className="text-sm text-gray-600">
                    {user.githubUrl ? (
                      <Link href={user.githubUrl} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                        {user.githubUrl}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                  <p className="text-sm text-gray-600">
                    {user.linkedinUrl ? (
                      <Link href={user.linkedinUrl} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                        {user.linkedinUrl}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : "Not provided"}
                  </p>
                </div>
              </div>
              
              {user.skills && user.skills.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-700">Resume/CV</label>
                <div className="mt-2">
                  {user.resume ? (
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                  ) : (
                    <span className="text-gray-500 text-sm">No resume uploaded</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Activity tracking will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          {user.employee?.company ? (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <p className="text-sm text-gray-600">{user.employee.company.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Industry</label>
                    <p className="text-sm text-gray-600">{user.employee.company.industry || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Size</label>
                    <p className="text-sm text-gray-600">{user.employee.company.size || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-600">{user.employee.company.location || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Website</label>
                    <p className="text-sm text-gray-600">
                      {user.employee.company.website ? (
                        <Link href={user.employee.company.website} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                          {user.employee.company.website}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Verification Status</label>
                    <Badge className={getStatusColor(user.employee.company.verificationStatus)}>
                      {user.employee.company.verificationStatus}
                    </Badge>
                  </div>
                </div>
                
                {user.employee.company.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-600 mt-1">{user.employee.company.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>This user is not associated with any company.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
