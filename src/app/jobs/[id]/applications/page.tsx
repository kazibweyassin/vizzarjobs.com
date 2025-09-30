"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  ArrowLeft,
  Briefcase, 
  Building2, 
  Calendar, 
  ExternalLink,
  Eye,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Mail,
  Phone,
  FileText,
  Download
} from "lucide-react";
import Link from "next/link";

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const jobId = params.id as string;
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Fetch job details
  const { data: job, isLoading: jobLoading } = api.jobs.getById.useQuery(
    { id: jobId },
    { enabled: !!jobId }
  );

  // Fetch applications for this job
  const {
    data: applications,
    isLoading: applicationsLoading,
    error,
    refetch
  } = api.applications.getByJobId.useQuery(
    { jobId },
    { 
      enabled: !!jobId && !!session?.user,
      refetchOnWindowFocus: false
    }
  );

  // Update application status mutation
  const updateStatusMutation = api.applications.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error updating application status:", error);
    }
  });

  const handleStatusUpdate = (applicationId: string, newStatus: string) => {
    updateStatusMutation.mutate({
      id: applicationId,
      status: newStatus as any
    });
  };

  const filteredApplications = applications?.filter(app => 
    statusFilter === "ALL" || app.status === statusFilter
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      case "REVIEWED":
        return <Badge variant="default" className="flex items-center gap-1"><Eye className="w-3 h-3" />Reviewed</Badge>;
      case "ACCEPTED":
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />Accepted</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-yellow-600";
      case "REVIEWED": return "text-blue-600";
      case "ACCEPTED": return "text-green-600";
      case "REJECTED": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to view applications.</p>
          <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (jobLoading || applicationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">Failed to load applications.</p>
          <button 
            onClick={() => refetch()}
            className="text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Job Applications
              </h1>
              {job && (
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{job.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{typeof job.company === 'string' ? job.company : job.company?.name}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link
                href={`/jobs/${jobId}`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Eye className="w-4 h-4" />
                View Job Details
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications?.filter(app => app.status === "PENDING").length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications?.filter(app => app.status === "ACCEPTED").length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications?.filter(app => app.status === "REJECTED").length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Applications</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">
                {statusFilter === "ALL" 
                  ? "No one has applied for this job yet." 
                  : `No applications with status "${statusFilter}".`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {application.user.name || "Anonymous Applicant"}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        {application.user.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${application.user.email}`} className="hover:text-blue-600">
                              {application.user.email}
                            </a>
                          </div>
                        )}
                        {application.user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${application.user.phone}`} className="hover:text-blue-600">
                              {application.user.phone}
                            </a>
                          </div>
                        )}
                        {application.user.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {application.user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Application Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Application Details</h4>
                      <div className="space-y-2">
                        {application.coverLetter && (
                          <div className="text-sm">
                            <p className="font-medium text-gray-700 mb-1">Cover Letter:</p>
                            <p className="text-gray-600 line-clamp-3">{application.coverLetter}</p>
                          </div>
                        )}
                        {application.user.resume && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <a 
                              href={application.user.resume} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              View Resume
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Update Status:</span>
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={updateStatusMutation.isPending}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {application.user.email && (
                          <a
                            href={`mailto:${application.user.email}?subject=Re: ${job?.title} Application`}
                            className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Mail className="w-4 h-4" />
                            Contact
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


