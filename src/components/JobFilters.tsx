"use client";

import { useState } from "react";
import { JobType, ExperienceLevel } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { 
  Search, 
  MapPin, 
  Filter, 
  X, 
  Award,
  Briefcase,
  TrendingUp,
  Code,
  Check,
  ChevronDown,
  DollarSign,
  Calendar,
  Crown
} from "lucide-react";
import { api } from "~/trpc/react";

export interface JobFiltersState {
  search: string;
  location: string;
  visaSponsorship: boolean | undefined;
  jobType: JobType | undefined;
  experienceLevel: ExperienceLevel | undefined;
  techStack: string[];
  techSpecialization?: string[]; // Specialized tech roles (DevOps, AI, ML)
  salaryMin?: number;
  salaryMax?: number;
  postedWithin?: 'day' | 'week' | 'month' | 'any';
  premiumOnly?: boolean;
  gtsEligible?: boolean; // Global Talent Stream eligible positions
  complianceManaged?: boolean; // Jobs with compliance automation
  categoryA?: boolean; // Category A GTS-eligible employers
}

interface JobFiltersProps {
  filters: JobFiltersState;
  onFiltersChange: (filters: JobFiltersState) => void;
  className?: string;
}

export function JobFilters({ filters, onFiltersChange, className }: JobFiltersProps) {
  const [showAllTechStacks, setShowAllTechStacks] = useState(false);
  
  // Get available tech stacks and locations from the API
  const { data: techStacks = [] } = api.jobs.getTechStacks.useQuery();
  const { data: locations = [] } = api.jobs.getLocations.useQuery();
  
  // Canadian locations to prioritize
  const canadianCities = [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton",
    "Ottawa", "Quebec City", "Winnipeg", "Halifax", "Victoria"
  ];
  
  // Filter and prioritize Canadian locations
  const sortedLocations = [...locations].sort((a, b) => {
    const aIsCanadian = a.includes("Canada") || canadianCities.some(city => a.includes(city));
    const bIsCanadian = b.includes("Canada") || canadianCities.some(city => b.includes(city));
    
    if (aIsCanadian && !bIsCanadian) return -1;
    if (!aIsCanadian && bIsCanadian) return 1;
    return a.localeCompare(b);
  });

  const jobTypes = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
  ] as const;

  const experienceLevels = [
    { value: "JUNIOR", label: "Junior" },
    { value: "MID", label: "Mid Level" },
    { value: "SENIOR", label: "Senior" },
  ] as const;

  const popularTechStacks = [
    "React", "TypeScript", "Node.js", "Python", "JavaScript", 
    "Next.js", "PostgreSQL", "AWS", "Docker", "Kubernetes"
  ];
  
  const specializedRoles = [
    { value: "Frontend", label: "Frontend Developer" },
    { value: "Backend", label: "Backend Developer" },
    { value: "Full Stack", label: "Full Stack Developer" },
    { value: "DevOps", label: "DevOps Engineer" },
    { value: "Cloud", label: "Cloud Engineer" },
    { value: "Security", label: "Security Engineer" },
    { value: "Mobile", label: "Mobile Developer" },
    { value: "QA", label: "QA/Testing Engineer" },
    { value: "Data Science", label: "Data Scientist" },
    { value: "Machine Learning", label: "ML Engineer" },
    { value: "AI", label: "AI Engineer" },
    { value: "Blockchain", label: "Blockchain Developer" }
  ];

  const displayedTechStacks = showAllTechStacks 
    ? techStacks 
    : popularTechStacks.filter(tech => techStacks.includes(tech));

  const updateFilters = (updates: Partial<JobFiltersState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      location: "Canada", // Default back to Canada when clearing filters
      visaSponsorship: undefined,
      jobType: undefined,
      experienceLevel: undefined,
      techStack: [],
      techSpecialization: ['DevOps', 'AI', 'Machine Learning'], // Keep specializations focused
      salaryMin: undefined,
      salaryMax: undefined,
      postedWithin: 'any',
    });
  };

  const toggleTechStack = (tech: string) => {
    const newTechStack = filters.techStack.includes(tech)
      ? filters.techStack.filter(t => t !== tech)
      : [...filters.techStack, tech];
    updateFilters({ techStack: newTechStack });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.location ||
    filters.visaSponsorship !== undefined ||
    filters.jobType ||
    filters.experienceLevel ||
    filters.techStack.length > 0 ||
    filters.salaryMin !== undefined ||
    filters.salaryMax !== undefined ||
    filters.postedWithin !== 'any';

  return (
    <Card className={`border border-gray-100 shadow-md bg-white rounded-xl ${className}`}>
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Reset all
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-7 py-6">
        {/* Search */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            Find Jobs
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Job title, company, or keywords..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 shadow-sm"
            />
            {filters.search && (
              <button
                onClick={() => updateFilters({ search: "" })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Location - Dropdown with modern UI */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Location
          </label>
          <div className="relative group">
            <select
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-gray-800 shadow-sm"
            >
              <option value="">Any location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </div>

        {/* Visa Sponsorship - Modern Toggle */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            Visa Sponsorship
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => updateFilters({ visaSponsorship: undefined })}
              className={`px-3 py-2.5 text-sm rounded-lg transition-all ${
                filters.visaSponsorship === undefined
                  ? "bg-blue-600 text-white font-medium shadow-sm"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-gray-100"
              }`}
            >
              {filters.visaSponsorship === undefined && <Check className="w-4 h-4 inline mr-1.5" />}
              All Jobs
            </button>
            <button
              onClick={() => updateFilters({ visaSponsorship: true })}
              className={`px-3 py-2.5 text-sm rounded-lg transition-all ${
                filters.visaSponsorship === true
                  ? "bg-green-600 text-white font-medium shadow-sm"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-gray-100"
              }`}
            >
              {filters.visaSponsorship === true && <Check className="w-4 h-4 inline mr-1.5" />}
              Sponsored
            </button>
            <button
              onClick={() => updateFilters({ visaSponsorship: false })}
              className={`px-3 py-2.5 text-sm rounded-lg transition-all ${
                filters.visaSponsorship === false
                  ? "bg-gray-800 text-white font-medium shadow-sm"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-400 hover:bg-gray-100"
              }`}
            >
              {filters.visaSponsorship === false && <Check className="w-4 h-4 inline mr-1.5" />}
              Not Offered
            </button>
          </div>
        </div>

        {/* Premium Jobs Filter */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-600" />
            Premium Jobs
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateFilters({ premiumOnly: undefined })}
              className={`px-3 py-2.5 text-sm rounded-lg transition-all ${
                filters.premiumOnly === undefined
                  ? "bg-blue-600 text-white font-medium shadow-sm"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-gray-100"
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => updateFilters({ premiumOnly: true })}
              className={`px-3 py-2.5 text-sm rounded-lg transition-all ${
                filters.premiumOnly === true
                  ? "bg-yellow-500 text-white font-medium shadow-sm"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-yellow-300 hover:bg-gray-100"
              }`}
            >
              {filters.premiumOnly === true && <Check className="w-4 h-4 inline mr-1.5" />}
              <Crown className="w-4 h-4 inline mr-1.5" />
              Premium Only
            </button>
          </div>
        </div>

        {/* Job Type - Pills with subtle hover effects */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Job Type
          </label>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilters({ 
                  jobType: filters.jobType === type.value ? undefined : type.value 
                })}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  filters.jobType === type.value
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-gray-100"
                }`}
              >
                {filters.jobType === type.value && <Check className="w-3.5 h-3.5 inline mr-1" />}
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level - Modern approach */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Experience Level
          </label>
          <div className="flex flex-wrap gap-2">
            {experienceLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => updateFilters({ 
                  experienceLevel: filters.experienceLevel === level.value ? undefined : level.value 
                })}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  filters.experienceLevel === level.value
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-gray-100"
                }`}
              >
                {filters.experienceLevel === level.value && <Check className="w-3.5 h-3.5 inline mr-1" />}
                {level.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tech Specialization - Highlighted section for DevOps, AI, ML roles */}
        <div className="space-y-2.5 bg-navy/5 p-4 rounded-lg border border-navy/10">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-navy flex items-center gap-2">
              <Code className="w-4 h-4 text-navy" />
              Tech Specialization
            </label>
            {filters.techSpecialization && filters.techSpecialization.length > 0 && (
              <button
                onClick={() => updateFilters({ techSpecialization: [] })}
                className="text-xs text-navy hover:text-navy/80 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {specializedRoles.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  // Toggle role in techSpecialization array
                  const currentSpecializations = filters.techSpecialization || [];
                  const isSelected = currentSpecializations.includes(role.value);
                  
                  updateFilters({ 
                    techSpecialization: isSelected
                      ? currentSpecializations.filter(r => r !== role.value)
                      : [...currentSpecializations, role.value]
                  });
                }}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  filters.techSpecialization?.includes(role.value)
                    ? "bg-navy text-white font-medium shadow-sm"
                    : "bg-white text-navy border border-navy/30 hover:bg-navy/5"
                }`}
              >
                {filters.techSpecialization?.includes(role.value) && <Check className="w-3.5 h-3.5 inline mr-1" />}
                {role.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-navy/70 mt-2">
            Focus on in-demand tech specializations across Canada
          </div>
        </div>

        {/* Salary Range */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            Salary Range
          </label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Min Salary</label>
                <input
                  type="number"
                  value={filters.salaryMin || ""}
                  onChange={(e) => updateFilters({ 
                    salaryMin: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  placeholder="$50,000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Salary</label>
                <input
                  type="number"
                  value={filters.salaryMax || ""}
                  onChange={(e) => updateFilters({ 
                    salaryMax: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  placeholder="$150,000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            {(filters.salaryMin || filters.salaryMax) && (
              <button
                onClick={() => updateFilters({ salaryMin: undefined, salaryMax: undefined })}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear salary filters
              </button>
            )}
          </div>
        </div>

        {/* Date Posted */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Date Posted
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'day', label: 'Last 24 hours' },
              { value: 'week', label: 'Last week' },
              { value: 'month', label: 'Last month' },
              { value: 'any', label: 'Any time' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilters({ 
                  postedWithin: filters.postedWithin === option.value ? 'any' : option.value as any
                })}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  filters.postedWithin === option.value
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-gray-100"
                }`}
              >
                {filters.postedWithin === option.value && <Check className="w-3.5 h-3.5 inline mr-1" />}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack - Modern chips */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" />
              Tech Stack
            </label>
            {filters.techStack.length > 0 && (
              <button
                onClick={() => updateFilters({ techStack: [] })}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear ({filters.techStack.length})
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {displayedTechStacks.map((tech) => (
              <button
                key={tech}
                onClick={() => toggleTechStack(tech)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                  filters.techStack.includes(tech)
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-gray-100"
                }`}
              >
                {filters.techStack.includes(tech) && <Check className="w-3 h-3 inline mr-1" />}
                {tech}
              </button>
            ))}
          </div>
          
          {techStacks.length > popularTechStacks.length && (
            <button
              onClick={() => setShowAllTechStacks(!showAllTechStacks)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              {showAllTechStacks ? (
                <>Show less<ChevronDown className="w-3.5 h-3.5 transform rotate-180" /></>
              ) : (
                <>Show all {techStacks.length} technologies<ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}

          {filters.techStack.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Selected tech:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filters.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 px-2.5 py-1"
                  >
                    {tech}
                    <button
                      onClick={() => toggleTechStack(tech)}
                      className="ml-1.5 hover:text-blue-900 bg-blue-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={clearFilters}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white font-medium rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Reset all filters
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
