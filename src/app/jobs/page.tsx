import { JobList } from "~/components/JobList";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { type JobFiltersState } from "~/components/JobFilters";

// Define the SearchParams type
type SearchParams = {
  search?: string;
  location?: string;
  visaSponsorship?: string;
  jobType?: string;
  experienceLevel?: string;
  techStack?: string | string[];
};

export default function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Process search params to create initial filters for JobList
  const initialFilters: Partial<JobFiltersState> = {
    search: searchParams.search || "",
    location: searchParams.location || "",
    visaSponsorship: searchParams.visaSponsorship === "true" 
      ? true 
      : searchParams.visaSponsorship === "false" 
        ? false 
        : undefined,
    jobType: searchParams.jobType as any,
    experienceLevel: searchParams.experienceLevel as any,
    techStack: Array.isArray(searchParams.techStack) 
      ? searchParams.techStack 
      : searchParams.techStack 
        ? [searchParams.techStack] 
        : [],
  };

  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-gray-600">Loading jobs...</span>
          </div>
        </div>
      }
    >
      <JobList initialFilters={initialFilters} />
    </Suspense>
  );
}
