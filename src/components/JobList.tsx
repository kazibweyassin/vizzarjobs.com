"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { JobFilters, type JobFiltersState } from "~/components/JobFilters";
import { PremiumJobCard } from "~/components/PremiumJobCard";
import { api } from "~/trpc/react";
import { Loader2, Search, Filter, MapPin, ArrowRight, Briefcase } from "lucide-react";
import { JobCardSkeleton } from "~/components/ui/skeleton";

interface JobListProps {
  showFilters?: boolean;
  initialFilters?: Partial<JobFiltersState>;
  limit?: number;
}

export function JobList({ 
  showFilters = true, 
  initialFilters = {},
  limit = 20 
}: JobListProps) {
  // Default job categories to focus on specialized tech roles
  const techSpecializations = useMemo(() => 
    initialFilters.techSpecialization || [], 
    [initialFilters.techSpecialization]
  );
  
  const [filters, setFilters] = useState<JobFiltersState>({
    search: "",
    location: "",
    visaSponsorship: undefined,
    jobType: undefined,
    experienceLevel: undefined,
    techStack: [],
    techSpecialization: techSpecializations.length ? techSpecializations : [], // Default to all tech roles - no specialization filter
    salaryMin: undefined,
    salaryMax: undefined,
    postedWithin: 'any',
    premiumOnly: undefined,
    ...initialFilters,
  });
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Determine if we're coming from a search query
  const isFromSearch = useMemo(() => Boolean(initialFilters.search || initialFilters.location), [initialFilters]);

  // Build the query input from filters
  const queryInput = useMemo(() => ({
    ...filters,
    // Only include non-empty values
    search: filters.search || undefined,
    location: filters.location || undefined,
    techStack: filters.techStack.length > 0 ? filters.techStack : undefined,
    techSpecialization: (filters.techSpecialization && filters.techSpecialization.length > 0) ? filters.techSpecialization : undefined,
    salaryMin: filters.salaryMin || undefined,
    salaryMax: filters.salaryMax || undefined,
    postedWithin: filters.postedWithin !== 'any' ? filters.postedWithin : undefined,
    limit,
  }), [filters, limit]);

  // Use different API based on premium filter
  const regularJobsQuery = api.jobs.getAll.useInfiniteQuery(
    queryInput,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !filters.premiumOnly,
    }
  );

  const premiumJobsQuery = api.jobs.getPremiumJobs.useInfiniteQuery(
    queryInput,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!filters.premiumOnly,
    }
  );

  // Use the appropriate query based on filter
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = filters.premiumOnly ? premiumJobsQuery : regularJobsQuery;

  const jobs = useMemo(
    () => data?.pages.flatMap((page) => page.jobs) ?? [],
    [data]
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Error loading jobs
          </div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          {showFilters && (
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <JobFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Search feedback banner */}
            {isFromSearch && (
              <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0F2C4C]/5 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-[#0F2C4C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Search Results</h3>
                    <p className="text-gray-600">
                      {filters.search && `Showing jobs matching "${filters.search}"`}
                      {filters.search && filters.location && " in "}
                      {filters.location && `${filters.location}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile Filter Toggle */}
            {showFilters && (
              <div className="lg:hidden mb-8">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg px-6 py-4 text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-semibold">Filters</span>
                  {(filters.search || filters.location || filters.visaSponsorship !== undefined || 
                    filters.jobType || filters.experienceLevel || filters.techStack.length > 0) && (
                    <span className="bg-amber-500 text-[#0F2C4C] text-xs rounded-full px-3 py-1 font-semibold">
                      Active
                    </span>
                  )}
                </button>
                
                {showMobileFilters && (
                  <div className="mt-4">
                    <JobFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#0F2C4C]">
                  Visa-Sponsored Jobs for East African Professionals
                </h1>
                {!isLoading && (
                  <div className="flex items-center mt-3 gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold border border-amber-200">
                      <Briefcase className="w-4 h-4" />
                      {jobs.length} opportunities
                    </span>
                    {filters.search && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        Search: "{filters.search}"
                        <button onClick={() => setFilters({...filters, search: ""})} className="text-gray-500 hover:text-gray-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    )}
                    {filters.location && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        {filters.location}
                        <button onClick={() => setFilters({...filters, location: ""})} className="text-gray-500 hover:text-gray-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm py-2.5 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2C4C] focus:border-[#0F2C4C]"
                  defaultValue="newest"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && jobs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No jobs found matching your criteria
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find jobs that match your preferences.
                </p>
                <button
                  onClick={() => setFilters({
                    search: "",
                    location: "",
                    visaSponsorship: undefined,
                    jobType: undefined,
                    experienceLevel: undefined,
                    techStack: [],
                  })}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold transition-all duration-200 shadow-sm"
                >
                  <span>Reset filters</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Jobs Grid */}
            {!isLoading && jobs.length > 0 && (
              <>
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <PremiumJobCard 
                      key={job.id}
                      job={job}
                      index={index}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-[#0F2C4C] hover:bg-[#1a3d63] text-white font-semibold transition-all duration-200 disabled:bg-gray-300 shadow-sm"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading more...
                        </>
                      ) : (
                        <>
                          <span>Load more jobs</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
