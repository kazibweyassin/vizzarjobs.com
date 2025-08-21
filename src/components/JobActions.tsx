"use client";

import { useState, useEffect } from "react";
import { Bookmark, Share2 } from "lucide-react";
import { saveJob, removeJob, isJobSaved } from "~/lib/savedJobs";
import { 
  trackApplication, 
  hasApplied,
  type ApplicationStatus
} from "~/lib/applications";
import { jobEvents, trackEvent } from "~/lib/analytics";

interface JobActionProps {
  jobId: string;
  applicationUrl?: string;
  jobTitle?: string;
}

export function JobActions({ jobId, applicationUrl, jobTitle = "Job Position" }: JobActionProps) {
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Check if the job is saved and if user has applied on component mount
  useEffect(() => {
    setSaved(isJobSaved(jobId));
    setApplied(hasApplied(jobId));
  }, [jobId]);
  
  const handleSaveToggle = () => {
    if (saved) {
      removeJob(jobId);
      // Track unsave action
      trackEvent({
        action: 'unsave_job',
        category: 'jobs',
        label: jobTitle,
        job_id: jobId
      });
    } else {
      saveJob(jobId);
      // Track save action
      trackEvent({
        action: 'save_job',
        category: 'jobs',
        label: jobTitle,
        job_id: jobId
      });
    }
    setSaved(!saved);
  };
  
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };
  
  const copyJobLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/jobs/${jobId}`);
    setShowShareMenu(false);
    
    // Track share action
    trackEvent({
      action: 'share_job',
      category: 'jobs',
      label: 'copy_link',
      job_id: jobId,
      job_title: jobTitle
    });
    
    // You could add a toast notification here
  };
  
  const shareViaEmail = () => {
    // We don't have job details here so we'll just use a generic message
    const subject = encodeURIComponent(`Job Opportunity on VizzarJobs`);
    const body = encodeURIComponent(
      `Check out this job on VizzarJobs:\n\n` +
      `${window.location.origin}/jobs/${jobId}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setShowShareMenu(false);
    
    // Track share action
    trackEvent({
      action: 'share_job',
      category: 'jobs',
      label: 'email',
      job_id: jobId,
      job_title: jobTitle
    });
  };
  
  const handleApply = () => {
    if (applicationUrl) {
      // Track the application in our system
      trackApplication(jobId);
      setApplied(true);
      
      // Track in Google Analytics
      jobEvents.apply(jobId, jobTitle);
      
      // Open the application URL
      window.open(applicationUrl, "_blank");
    }
  };
  
  return (
    <div className="flex gap-2">
      {/* Save button */}
      <button
        onClick={handleSaveToggle}
        className={`p-2 rounded-full transition-colors ${
          saved ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
        aria-label={saved ? "Unsave job" : "Save job"}
      >
        <Bookmark className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
      </button>
      
      {/* Share button with dropdown */}
      <div className="relative">
        <button
          onClick={handleShare}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Share job"
        >
          <Share2 className="w-5 h-5" />
        </button>
        
        {showShareMenu && (
          <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 py-1 w-40 z-10">
            <button
              onClick={copyJobLink}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
            >
              Copy link
            </button>
            <button
              onClick={shareViaEmail}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
            >
              Share via email
            </button>
          </div>
        )}
      </div>
      
      {/* Apply button */}
      {applicationUrl && (
        <button 
          onClick={handleApply}
          className={`px-6 py-2 rounded-md transition-colors font-medium ${
            applied 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {applied ? 'Applied' : 'Apply Now'}
        </button>
      )}
    </div>
  );
}
