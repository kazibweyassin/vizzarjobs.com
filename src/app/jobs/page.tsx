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

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await searchParams for Next.js 15 compatibility
  const resolvedSearchParams = await searchParams;
  
  // Process search params to create initial filters for JobList
  const initialFilters: Partial<JobFiltersState> = {
    search: resolvedSearchParams.search || "",
    location: resolvedSearchParams.location || "",
    visaSponsorship: resolvedSearchParams.visaSponsorship === "true" 
      ? true 
      : resolvedSearchParams.visaSponsorship === "false" 
        ? false 
        : undefined,
    jobType: resolvedSearchParams.jobType as any,
    experienceLevel: resolvedSearchParams.experienceLevel as any,
    techStack: Array.isArray(resolvedSearchParams.techStack) 
      ? resolvedSearchParams.techStack 
      : resolvedSearchParams.techStack 
        ? [resolvedSearchParams.techStack] 
        : [],
  };

  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F2C4C]" />
            <span className="text-gray-600">Loading jobs...</span>
          </div>
        </div>
      }
    >
      <JobList initialFilters={initialFilters} />
    </Suspense>
  );
}
