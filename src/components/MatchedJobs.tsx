"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import {
  Briefcase,
  MapPin,
  Building2,
  BadgeCheck,
  ChevronRight,
  Clock,
  CalendarDays
} from "lucide-react";

export default function MatchedJobs() {
  const [sortBy, setSortBy] = useState<"match" | "recent">("match");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRemote, setFilterRemote] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Get matched jobs
  const { data: matchedJobs, isLoading } = api.matching.getMatchedJobs.useQuery({ limit: 50 });

  // Filter jobs by search query and other filters
  const filteredJobs = matchedJobs?.items.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRemote = filterRemote ? job.remote : true;

    const matchesLocation = selectedLocation 
      ? job.location && job.location.includes(selectedLocation)
      : true;

    return matchesSearch && matchesRemote && matchesLocation;
  });

  // Sort jobs
  const sortedJobs = filteredJobs ? [...filteredJobs].sort((a, b) => {
    if (sortBy === "match") {
      return b.matchScore - a.matchScore;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  }) : [];

  // Get unique locations for filtering
  const uniqueLocations = matchedJobs?.items
    .map(job => job.location)
    .filter((location): location is string => !!location)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Format date relative to now
  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Match criteria display helper
  const getMatchCriteria = (job: any) => {
    const criteria = [];
    
    if (job.matchScore >= 80) {
      criteria.push("Skills match");
    }
    
    if (job.remote) {
      criteria.push("Remote work");
    }
    
    if (job.visaSponsorship) {
      criteria.push("Visa sponsorship");
    }
    
    return criteria.length > 0 ? criteria : ["Location match"];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>Matched Jobs</CardTitle>
          <div className="mt-2 md:mt-0">
            <Badge className="bg-blue-100 text-blue-800 font-medium">
              {isLoading ? "Calculating..." : `${sortedJobs?.length || 0} Matches`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-60"
          />
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="remote-only" 
                checked={filterRemote}
                onCheckedChange={(checked) => setFilterRemote(checked as boolean)}
              />
              <label htmlFor="remote-only" className="text-sm cursor-pointer">Remote Only</label>
            </div>
            
            <select 
              className="text-sm border rounded-md px-2 py-1"
              value={selectedLocation || ""}
              onChange={(e) => setSelectedLocation(e.target.value || null)}
            >
              <option value="">All Locations</option>
              {uniqueLocations?.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy(sortBy === "match" ? "recent" : "match")}
              className="text-sm"
            >
              Sort: {sortBy === "match" ? "Best Match" : "Recent"}
            </Button>
          </div>
        </div>
      </div>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-10">
            <p>Finding matches...</p>
          </div>
        ) : sortedJobs && sortedJobs.length > 0 ? (
          <div className="space-y-4">
            {sortedJobs.map((job) => (
              <div key={job.id} className="border rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building2 className="h-4 w-4 mr-1" />
                        {job.company.name}
                        {job.company.verified && (
                          <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-blue-600">{job.matchScore}%</div>
                      <div className="text-xs text-gray-500">match score</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    {job.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                    
                    {job.type && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      {formatRelativeDate(job.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs font-medium uppercase text-gray-500 mb-1">Why this matches</div>
                    <div className="flex flex-wrap gap-1">
                      {getMatchCriteria(job).map((criteria, index) => (
                        <Badge key={index} variant="secondary">
                          {criteria}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium uppercase text-gray-500 mb-1">Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 5 && (
                          <Badge variant="outline">+{job.skills.length - 5} more</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Save</Button>
                      <Button size="sm">Apply Now</Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" style={{ 
                  width: `${job.matchScore}%` 
                }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No matching jobs found for your preferences.</p>
            <p className="text-sm text-gray-400 mt-2">Try updating your matching preferences to see more jobs.</p>
            <Button asChild className="mt-4">
              <a href="/profile/matching">Update Preferences</a>
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-6 flex justify-between">
        <Button variant="outline">Filter Options</Button>
        <Button>View All Jobs</Button>
      </CardFooter>
    </Card>
  );
}
