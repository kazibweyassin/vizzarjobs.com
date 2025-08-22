"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Briefcase, MapPin, Building2, BadgeCheck, ChevronRight } from "lucide-react";

interface MatchedCandidatesProps {
  jobId: string;
}

export default function MatchedCandidates({ jobId }: MatchedCandidatesProps) {
  const [sortBy, setSortBy] = useState<"match" | "recent">("match");
  const [searchQuery, setSearchQuery] = useState("");

  // Get job details
  const { data: job, isLoading: jobLoading } = api.jobs.getById.useQuery(
    { id: jobId },
    { enabled: !!jobId }
  );

  // Get matched candidates
  const { data: matchedCandidates, isLoading: candidatesLoading } = api.matching.getMatchedCandidates.useQuery(
    { jobId, limit: 50 },
    { enabled: !!jobId }
  );

  // Filter candidates by search query
  const filteredCandidates = matchedCandidates?.items.filter(candidate => 
    candidate.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.matchedSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort candidates
  const sortedCandidates = filteredCandidates ? [...filteredCandidates].sort((a, b) => {
    if (sortBy === "match") {
      return b.matchScore - a.matchScore;
    } else {
      // Sort by some other criteria like recently active
      return 0; // Placeholder, need additional data for proper sorting
    }
  }) : [];

  if (jobLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p>Loading job details...</p>
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p>Job not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>{job.title}</CardTitle>
          <div className="mt-2 md:mt-0">
            <Badge className="bg-blue-100 text-blue-800 font-medium">
              {candidatesLoading ? "Calculating..." : `${sortedCandidates?.length || 0} Matches`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          {/* Job details */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              {job.company?.name || "Unknown Company"}
            </div>
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
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-60"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === "match" ? "recent" : "match")}
            >
              Sort: {sortBy === "match" ? "Best Match" : "Recent"}
            </Button>
          </div>
        </div>
      </div>

      <CardContent>
        {candidatesLoading ? (
          <div className="text-center py-10">
            <p>Finding matches...</p>
          </div>
        ) : sortedCandidates && sortedCandidates.length > 0 ? (
          <div className="space-y-4">
            {sortedCandidates.map((candidate) => (
              <div key={candidate.user.id} className="border rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-600">
                        {candidate.user.name ? candidate.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="font-medium">{candidate.user.name || "Anonymous User"}</h3>
                          {candidate.user.verified && (
                            <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{candidate.user.location || "Location not specified"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-blue-600">{candidate.matchScore}%</div>
                      <div className="text-xs text-gray-500">match score</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">Matching Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {candidate.matchedSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.matchedSkills.length === 0 && (
                        <span className="text-sm text-gray-500">No matching skills found</span>
                      )}
                    </div>
                  </div>
                  
                  {candidate.user.bio && (
                    <div className="mt-3 text-sm text-gray-600">
                      {candidate.user.bio.length > 150 
                        ? `${candidate.user.bio.substring(0, 150)}...` 
                        : candidate.user.bio}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Contact</Button>
                      <Button variant="outline" size="sm">Save</Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      View Profile <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" style={{ 
                  width: `${candidate.matchScore}%` 
                }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No matching candidates found for this job posting.</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting the job requirements to find more candidates.</p>
            <Button className="mt-4" variant="outline">
              Edit Job Requirements
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-6 flex justify-between">
        <Button variant="outline">Export Candidates</Button>
        <Button>Contact All Matched Candidates</Button>
      </CardFooter>
    </Card>
  );
}
