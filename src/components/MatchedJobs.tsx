"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { 
  Building, 
  MapPin, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Star, 
  ArrowRight,
  DollarSign
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

export function MatchedJobs() {
  const [page, setPage] = useState(0);
  const limit = 5;
  
  const { data, isLoading, error } = api.matching.getMatchedJobs.useQuery({
    limit,
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded" />
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
        <p className="text-red-500">Error loading matched jobs: {error.message}</p>
      </div>
    );
  }
  
  if (!data?.items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No matched jobs found based on your preferences.</p>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your matching preferences or check back later.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="space-y-4">
        {data.items.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <div className="relative">
              {job.featured && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              )}
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-500">
                  {job.matchScore}% Match
                </Badge>
              </div>
              
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  {job.company.logo ? (
                    <img 
                      src={job.company.logo} 
                      alt={job.company.name} 
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                      <Building className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="flex items-center">
                        {job.company.name}
                        {job.company.verified && (
                          <CheckCircle2 className="h-3 w-3 text-blue-500 ml-1" />
                        )}
                      </span>
                      
                      {job.location && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </span>
                        </>
                      )}
                      
                      {job.remote && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Remote</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {job.description && (
                  <p className="mt-4 text-gray-700 text-sm line-clamp-2">
                    {job.description}
                  </p>
                )}
                
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {job.salary && (
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                      {job.salary}
                    </div>
                  )}
                  
                  {job.type && (
                    <div className="flex items-center text-gray-700">
                      <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                      {job.type}
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 border-t px-6 py-3 flex justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-700">
                    Match quality: <span className="font-medium">{job.matchScore}%</span>
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/jobs/${job.id}`}>View Job</a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={`/jobs/${job.id}#apply`}>Apply Now</a>
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
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  );
}
