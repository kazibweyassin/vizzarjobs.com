"use client";

import { useEffect } from "react";
import { jobEvents } from "~/lib/analytics";

interface JobViewTrackerProps {
  jobId: string;
  jobTitle: string;
}

export function JobViewTracker({ jobId, jobTitle }: JobViewTrackerProps) {
  useEffect(() => {
    // Track job view when component mounts
    jobEvents.view(jobId, jobTitle);
  }, [jobId, jobTitle]);

  // This component doesn't render anything
  return null;
}
