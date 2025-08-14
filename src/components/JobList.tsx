"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { JobFilters, type JobFiltersState } from "~/components/JobFilters";
import { api } from "~/trpc/react";
import { Loader2, Search, Filter, MapPin, Clock, Globe, Building2, ArrowRight } from "lucide-react";

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

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.jobs.getAll.useInfiniteQuery(
    queryInput,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium text-gray-800">Search results</h3>
                    <p className="text-sm text-gray-600">
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
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(filters.search || filters.location || filters.visaSponsorship !== undefined || 
                    filters.jobType || filters.experienceLevel || filters.techStack.length > 0) && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
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
                <h1 className="text-3xl font-bold text-gray-900">
                  {filters.visaSponsorship === true ? "Visa Sponsored Jobs" : "Browse Jobs"}
                </h1>
                {!isLoading && (
                  <div className="flex items-center mt-2">
                    <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-2">
                      {jobs.length} jobs
                    </span>
                    {filters.search && (
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full mr-2 flex items-center">
                        Search: "{filters.search}"
                        <button onClick={() => setFilters({...filters, search: ""})} className="ml-1.5 text-gray-500 hover:text-gray-800">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    )}
                    {filters.location && (
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full mr-2 flex items-center">
                        {filters.location}
                        <button onClick={() => setFilters({...filters, location: ""})} className="ml-1.5 text-gray-500 hover:text-gray-800">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="newest"
                  >
                    <option value="newest">Newest First</option>
                    <option value="relevant">Most Relevant</option>
                    <option value="salary">Highest Salary</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                
                <button className="inline-flex items-center justify-center p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                
                <button className="inline-flex items-center justify-center p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading jobs...</span>
              </div>
            )}

            {/* No Results */}
            {!isLoading && jobs.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find more jobs.
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
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Jobs Grid */}
            {!isLoading && jobs.length > 0 && (
              <>
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <div key={job.id} className="group">
                      <Link 
                        href={`/jobs/${job.id}`}
                        className="block bg-white rounded-xl p-0 shadow-sm hover:shadow border border-gray-200 hover:border-gray-300 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6">
                          {/* Left side with company logo and job details */}
                          <div className="flex gap-4 items-start mb-4 md:mb-0">
                            <div className="hidden md:block flex-shrink-0">
                              {job.companyRelation?.logo ? (
                                <img 
                                  src={job.companyRelation.logo} 
                                  alt={job.companyRelation.name || "Company logo"}
                                  className="w-14 h-14 object-contain rounded-md border border-gray-100"
                                />
                              ) : (
                                <div className="w-14 h-14 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400">
                                  <Building2 className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {job.title}
                                </h3>
                                {job.visaSponsorship && (
                                  <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-100 whitespace-nowrap">
                                    Visa Sponsored
                                  </span>
                                )}
                                {job.jobType === 'REMOTE' && (
                                  <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full border border-purple-100">
                                    Remote
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-600 font-medium">
                                {job.companyRelation ? job.companyRelation.name : "Company"}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <div className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                  <span>{job.location || (job.companyRelation ? job.companyRelation.location : "Remote")}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                  <span>{new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right side with salary and apply button */}
                          <div className="flex flex-col items-end">
                            {job.salaryMin && job.salaryMax && (
                              <div className="text-gray-900 font-medium mb-2">
                                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                              </div>
                            )}
                            <span className="text-sm text-blue-700 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                              View Details
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>

                        {/* Tech Stack and Job Details Footer */}
                        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100 flex flex-wrap gap-y-3 justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            {job.techStack && job.techStack.length > 0 ? job.techStack.slice(0, 5).map((tech, i) => (
                              <span key={i} className="bg-white text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                                {tech}
                              </span>
                            )) : (
                              <span className="text-xs text-gray-500">No tech stack specified</span>
                            )}
                            {job.techStack && job.techStack.length > 5 && (
                              <span className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full whitespace-nowrap">
                                +{job.techStack.length - 5} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-3">
                            {job.experienceLevel && (
                              <span className="flex items-center text-xs text-gray-600 whitespace-nowrap">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                                {job.experienceLevel.replace('_', ' ')}
                              </span>
                            )}
                            {job.jobType && (
                              <span className="flex items-center text-xs text-gray-600 whitespace-nowrap">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                                {job.jobType.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasNextPage && (
                  <div 
                    className="flex justify-center mt-8"
                  >
                    <button
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading more...
                        </>
                      ) : (
                        "Load more jobs"
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
