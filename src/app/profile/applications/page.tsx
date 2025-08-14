"use client";

import { useState, useEffect } from "react";
import { 
  getApplicationsArray, 
  updateApplicationStatus, 
  updateApplicationNotes, 
  removeApplication,
  type ApplicationStatus, 
  type JobApplication,
  getStatusLabel,
  getStatusColor
} from "~/lib/applications";
import { api } from "~/trpc/react";
import { 
  Loader2, 
  AlertCircle, 
  X, 
  Briefcase, 
  ChevronDown, 
  Clock, 
  PencilLine, 
  StickyNote, 
  Check, 
  Trash2
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
  
  // Status options
  const statusOptions: ApplicationStatus[] = [
    'applied',
    'interviewing',
    'offer',
    'rejected',
    'withdrawn',
    'declined'
  ];
  
  // Get applications from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const apps = getApplicationsArray();
    setApplications(apps);
  }, []);
  
  // Query jobs data for applications
  const jobIds = applications.map(app => app.jobId);
  const { data: jobs, isLoading, error } = api.jobs.getByIds.useQuery(
    { ids: jobIds },
    { enabled: jobIds.length > 0 && isClient }
  );
  
  // Handle status update
  const handleStatusUpdate = (jobId: string, status: ApplicationStatus) => {
    updateApplicationStatus(jobId, status);
    setApplications(getApplicationsArray());
    setStatusDropdown(null);
  };
  
  // Handle notes update
  const handleSaveNotes = (jobId: string) => {
    updateApplicationNotes(jobId, notesValue);
    setApplications(getApplicationsArray());
    setEditingNotes(null);
  };
  
  // Handle application removal
  const handleRemoveApplication = (jobId: string) => {
    if (confirm("Are you sure you want to remove this application from tracking?")) {
      removeApplication(jobId);
      setApplications(getApplicationsArray());
    }
  };
  
  // Start editing notes
  const startEditingNotes = (jobId: string, currentNotes?: string) => {
    setEditingNotes(jobId);
    setNotesValue(currentNotes || "");
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // If not yet on client-side, show a loading state
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }
  
  // No applications
  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mb-3" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No job applications yet</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Start applying for jobs and track your application progress here.
              This helps you stay organized during your job search.
            </p>
            <Link 
              href="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Find Jobs
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Error loading applications: {error.message}</p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading your applications...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      
      <div className="space-y-4">
        {applications.map(application => {
          const job = jobs?.find(j => j.id === application.jobId);
          if (!job) return null;
          
          return (
            <Card key={application.jobId} className="overflow-hidden">
              <div className="border-l-4 border-blue-500 pl-4 py-4 pr-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-lg">
                      <Link 
                        href={`/jobs/${job.id}`}
                        className="text-gray-900 hover:text-blue-600 hover:underline"
                      >
                        {job.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <div>
                    {/* Status dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setStatusDropdown(statusDropdown === application.jobId ? null : application.jobId)}
                        className={`px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(application.status)}`}
                      >
                        {getStatusLabel(application.status)}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {statusDropdown === application.jobId && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[160px]">
                          {statusOptions.map(status => (
                            <button
                              key={status}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                status === application.status ? 'font-medium bg-gray-50' : ''
                              }`}
                              onClick={() => handleStatusUpdate(application.jobId, status)}
                            >
                              {getStatusLabel(status)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Applied on {formatDate(application.appliedAt)}
                  </div>
                </div>
                
                {/* Notes section */}
                <div className="mt-4">
                  {editingNotes === application.jobId ? (
                    <div className="mt-2">
                      <textarea
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add notes about this application..."
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setEditingNotes(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(application.jobId)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {application.notes ? (
                        <div className="bg-gray-50 rounded-md p-3 mt-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                              <StickyNote className="w-3 h-3" />
                              Notes
                            </div>
                            <button
                              onClick={() => startEditingNotes(application.jobId, application.notes)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <PencilLine className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 whitespace-pre-line">{application.notes}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingNotes(application.jobId)}
                          className="text-sm text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1"
                        >
                          <PencilLine className="w-3 h-3" />
                          Add notes
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleRemoveApplication(application.jobId)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
