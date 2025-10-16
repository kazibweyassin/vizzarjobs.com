"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { JobFilters, type JobFiltersState } from "~/components/JobFilters";
import { PremiumJobCard } from "~/components/PremiumJobCard";
import { api } from "~/trpc/react";
import { Loader2, Search, Filter, MapPin, Clock, Globe, Building2, ArrowRight, Briefcase } from "lucide-react";
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
  const [filters, setFilters] = useState<JobFiltersState>({
    search: "",
    location: "",
    visaSponsorship: undefined,
    jobType: undefined,
    experienceLevel: undefined,
    techStack: [],
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
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
              <div className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Search Results</h3>
                    <p className="text-slate-600">
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
                  className="w-full flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-slate-700 hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold">Filters</span>
                  {(filters.search || filters.location || filters.visaSponsorship !== undefined || 
                    filters.jobType || filters.experienceLevel || filters.techStack.length > 0) && (
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full px-3 py-1 font-semibold">
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {filters.visaSponsorship === true ? "Visa Sponsored Jobs" : "Browse Jobs"}
                </h1>
                {!isLoading && (
                  <div className="flex items-center mt-3 gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                      <Briefcase className="w-4 h-4" />
                      {jobs.length} jobs
                    </span>
                    {filters.search && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        Search: "{filters.search}"
                        <button onClick={() => setFilters({...filters, search: ""})} className="text-slate-500 hover:text-slate-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    )}
                    {filters.location && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        {filters.location}
                        <button onClick={() => setFilters({...filters, location: ""})} className="text-slate-500 hover:text-slate-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select 
                    className="appearance-none bg-white/80 backdrop-blur-sm border border-white/20 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    defaultValue="newest"
                  >
                    <option value="newest">Newest First</option>
                    <option value="relevant">Most Relevant</option>
                    <option value="salary">Highest Salary</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                
                <button className="inline-flex items-center justify-center p-3 rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                
                <button className="inline-flex items-center justify-center p-3 rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
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
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No jobs found
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find more jobs that match your criteria.
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
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Clear all filters</span>
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
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 disabled:bg-gray-300 shadow-lg hover:shadow-xl hover:scale-105"
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
