"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { 
  UserCircle2, 
  MapPin, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Star, 
  ArrowRight
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

interface MatchedCandidatesProps {
  jobId: string;
}

export function MatchedCandidates({ jobId }: MatchedCandidatesProps) {
  const [page, setPage] = useState(0);
  const limit = 5;
  
  const { data, isLoading, error } = api.matching.getMatchedCandidates.useQuery({
    jobId,
    limit,
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <Skeleton className="h-10 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading matched candidates: {error.message}</p>
      </div>
    );
  }
  
  if (!data?.items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No matched candidates found for this job.</p>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your job requirements or check back later.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="space-y-4">
        {data.items.map((candidate) => (
          <Card key={candidate.user.id} className="overflow-hidden">
            <div className="relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-500">
                  {candidate.matchScore}% Match
                </Badge>
              </div>
              
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  {candidate.user.image ? (
                    <img 
                      src={candidate.user.image} 
                      alt={candidate.user.name || "Candidate"} 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircle2 className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-lg flex items-center">
                      {candidate.user.name || "Anonymous User"}
                      {candidate.user.verified && (
                        <CheckCircle2 className="h-4 w-4 text-blue-500 ml-1" />
                      )}
                    </h3>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      {candidate.user.location && (
                        <div className="flex items-center mr-4">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{candidate.user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {candidate.user.bio && (
                  <p className="mt-4 text-gray-700 text-sm line-clamp-2">
                    {candidate.user.bio}
                  </p>
                )}
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Matched Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.matchedSkills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-green-50 text-green-700">
                        {skill}
                      </Badge>
                    ))}
                    
                    {candidate.user.skills.filter(skill => !candidate.matchedSkills.includes(skill))
                      .slice(0, 3)
                      .map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700">
                          {skill}
                        </Badge>
                      ))
                    }
                    
                    {candidate.user.skills.length - candidate.matchedSkills.length > 3 && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        +{candidate.user.skills.length - candidate.matchedSkills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 border-t px-6 py-3 flex justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-700">
                    Match quality: <span className="font-medium">{candidate.matchScore}%</span>
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                  <Button size="sm">
                    Contact
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
      
      {data.nextCursor && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setPage(prev => prev + 1)}>
            Load More Candidates
          </Button>
        </div>
      )}
    </div>
  );
}
