"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '~/trpc/react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign,
  Briefcase,
  Building2,
  MoreVertical,
  Power,
  PowerOff,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { JobType, ExperienceLevel } from '@prisma/client';
import { SafeHTML } from '~/components/SafeHTML';

export default function EmployerJobManagementPage() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Redirect if not logged in
  if (status === 'unauthenticated') {
    router.push('/auth/signin?callbackUrl=/dashboard/employer/jobs');
    return null;
  }

  // Fetch employer's jobs
  const { data: jobs, isLoading, error, refetch } = api.jobs.getByEmployer.useQuery(undefined, {
    enabled: !!sessionData?.user,
    retry: false,
  });

  // Mutations
  const deleteJobMutation = api.jobs.delete.useMutation({
    onSuccess: () => {
      refetch();
      setShowDeleteConfirm(null);
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
    }
  });

  const handleDeleteJob = (jobId: string) => {
    deleteJobMutation.mutate({ id: jobId });
  };

  const getJobTypeColor = (jobType: JobType) => {
    switch (jobType) {
      case 'FULL_TIME': return 'bg-blue-100 text-blue-800';
      case 'PART_TIME': return 'bg-green-100 text-green-800';
      case 'CONTRACT': return 'bg-purple-100 text-purple-800';
      case 'INTERNSHIP': return 'bg-orange-100 text-orange-800';
      case 'FREELANCE': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceColor = (level: ExperienceLevel) => {
    switch (level) {
      case 'JUNIOR': return 'bg-green-100 text-green-800';
      case 'MID': return 'bg-blue-100 text-blue-800';
      case 'SENIOR': return 'bg-purple-100 text-purple-800';
      case 'LEAD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading your jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Jobs</h2>
        <p className="text-red-600 mb-4">{error.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
              <p className="text-gray-600 mt-2">Manage your job postings and track applications</p>
            </div>
            <Link href="/jobs/post">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Power className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs?.reduce((sum, job) => sum + job.applications.length, 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Company</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {jobs?.[0]?.company?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        {jobs && jobs.length > 0 ? (
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        {job.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
                        {job.premium && (
                          <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <Badge className={getJobTypeColor(job.jobType)}>
                            {job.jobType.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={getExperienceColor(job.experienceLevel)}>
                            {job.experienceLevel}
                          </Badge>
                        </div>
                        {job.salaryMin && job.salaryMax && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <Link href={`/jobs/edit/${job.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(job.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Job Description Preview */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <div className="prose prose-sm max-w-none">
                        <SafeHTML 
                          content={job.description?.substring(0, 300) + (job.description && job.description.length > 300 ? '...' : '') || 'No description provided'} 
                          className="text-gray-600"
                        />
                      </div>
                    </div>
                    
                    {/* Applications */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Applications ({job.applications.length})</h4>
                      {job.applications.length > 0 ? (
                        <div className="space-y-2">
                          {job.applications.slice(0, 3).map((application) => (
                            <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{application.user.name}</p>
                                <p className="text-sm text-gray-600">{application.user.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-100 text-blue-800">
                                  {application.status}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {new Date(application.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                          {job.applications.length > 3 && (
                            <p className="text-sm text-gray-500 text-center">
                              +{job.applications.length - 3} more applications
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No applications yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h3>
              <p className="text-gray-600 mb-6">Start by posting your first job to attract top talent.</p>
              <Link href="/jobs/post">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Job
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-600">Delete Job</CardTitle>
                <CardDescription>
                  Are you sure you want to delete this job? This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteJob(showDeleteConfirm)}
                  disabled={deleteJobMutation.isPending}
                  className="flex-1"
                >
                  {deleteJobMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
