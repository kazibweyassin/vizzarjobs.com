"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Search, 
  Building2, 
  MapPin, 
  Users, 
  ExternalLink,
  Loader2,
  Globe,
  Briefcase
} from "lucide-react";
import { CompanyCardSkeleton } from "~/components/ui/skeleton";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.companies.getAll.useInfiniteQuery(
    {
      search: searchTerm || undefined,
      industry: selectedIndustry || undefined,
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { data: industries = [] } = api.companies.getIndustries.useQuery();

  const companies = data?.pages.flatMap((page) => page.companies) ?? [];

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
            Error loading companies
          </div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Companies
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore companies that are actively hiring and offer visa sponsorship opportunities worldwide
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white/50 backdrop-blur-sm text-slate-800 placeholder-slate-500 shadow-sm"
                />
              </div>

              {/* Industry Filter */}
              <div className="md:w-64">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white/50 backdrop-blur-sm text-slate-800 shadow-sm"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            {!isLoading && (
              <div className="mt-4 text-slate-600 font-medium">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  <Building2 className="w-4 h-4" />
                  {companies.length} companies found
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedIndustry && ` in ${selectedIndustry}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && companies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No companies found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedIndustry("");
              }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Companies Grid */}
        {!isLoading && companies.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {companies.map((company) => (
                <Card key={company.id} className="group hover:shadow-2xl transition-all duration-500 border border-white/20 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:scale-[1.02] hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-14 h-14 rounded-xl object-contain flex-shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Building2 className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </CardTitle>
                        {company.industry && (
                          <p className="text-sm text-slate-600 truncate font-medium">{company.industry}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {company.description && (
                      <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
                        {company.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      {company.location && (
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{company.location}</span>
                        </div>
                      )}
                      
                      {company.size && (
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium">{company.size} employees</span>
                        </div>
                      )}
                      
                      {company._count && (
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{company._count.jobs} open positions</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                      <div className="flex gap-3">
                        {company.website && (
                          <Link
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </Link>
                        )}
                      </div>
                      
                      <Link
                        href={`/companies/${company.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        View Jobs
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 disabled:bg-gray-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    <>
                      <span>Load more companies</span>
                      <Building2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
