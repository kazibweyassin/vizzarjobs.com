"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSavedJobsArray, removeJob } from "~/lib/savedJobs";
import { api } from "~/trpc/react";
import { Loader2, AlertCircle, X, BookmarkX } from "lucide-react";
import { JobCard } from "~/components/JobCard";
import { Card, CardContent } from "~/components/ui/card";

export default function SavedJobsPage() {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Get saved job IDs from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedJobs = getSavedJobsArray();
    setSavedJobIds(savedJobs.map(job => job.id));
  }, []);
  
  // Query jobs data for saved jobs
  const { data, isLoading, error } = api.jobs.getByIds.useQuery(
    { ids: savedJobIds },
    { enabled: savedJobIds.length > 0 && isClient }
  );
  
  // Handle removing a job from saved
  const handleRemove = (jobId: string) => {
    removeJob(jobId);
    setSavedJobIds(prev => prev.filter(id => id !== jobId));
  };
  
  // If not yet on client-side, show a loading state
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }
  
  // No saved jobs
  if (savedJobIds.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <BookmarkX className="w-12 h-12 text-gray-400 mb-3" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No saved jobs yet</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Save jobs you're interested in by clicking the bookmark icon on job cards.
              Your saved jobs will appear here for easy access.
            </p>
            <Link 
              href="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Browse Jobs
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
        <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Error loading saved jobs: {error.message}</p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading your saved jobs...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
      
      <div className="space-y-4">
        {data?.map(job => (
          <div key={job.id} className="relative">
            <button 
              onClick={() => handleRemove(job.id)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Remove from saved jobs"
            >
              <X className="w-4 h-4" />
            </button>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
}
