"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import JobCard from "~/components/JobCard";
import { Skeleton } from "~/components/ui/skeleton";
import AnimatedHeading from "~/components/animations/AnimatedHeading";

interface JobRecommendationsProps {
  userId?: string;
  limit?: number;
}

export default function JobRecommendations({ userId, limit = 3 }: JobRecommendationsProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Get recommended jobs if user ID is provided
  const { data: recommendedJobs = [], isLoading: isLoadingRecommended } = api.jobs.getRecommended.useQuery(
    { limit },
    { 
      enabled: !!userId,
      onSettled: () => setIsLoading(false)
    }
  );
  
  // If no userId, show popular jobs instead
  const { data: popularJobs = [], isLoading: isLoadingPopular } = api.jobs.getPopular.useQuery(
    { limit },
    { 
      enabled: !userId,
      onSettled: () => setIsLoading(false)
    }
  );

  // Determine which jobs to display
  const jobs = userId ? recommendedJobs : popularJobs;
  const isLoadingJobs = userId ? isLoadingRecommended : isLoadingPopular;
  const title = userId ? "Recommended For You" : "Popular Jobs";
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-6">
      <AnimatedHeading className="text-2xl mb-6" underline>
        {title}
      </AnimatedHeading>
      
      {isLoadingJobs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(limit).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 mb-4" />
              <div className="flex space-x-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No jobs to show at the moment. Check back later!
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {jobs.map(job => (
            <motion.div key={job.id} variants={item}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
