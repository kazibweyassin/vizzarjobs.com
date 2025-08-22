import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const matchingRouter = createTRPCRouter({
  // Get user's matching preferences
  getUserMatchingPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      
      return ctx.db.matchingPreferences.findUnique({
        where: {
          userId,
        },
      });
    }),
    
  // Update user's matching preferences
  updateMatchingPreferences: protectedProcedure
    .input(z.object({
      jobRoles: z.array(z.string()),
      skills: z.array(z.string()),
      industries: z.array(z.string()),
      locations: z.array(z.string()),
      remotePreference: z.boolean(),
      salaryMin: z.number(),
      salaryMax: z.number(),
      experienceLevels: z.array(z.string()),
      employmentTypes: z.array(z.string()),
      visaSponsorshipNeeded: z.boolean(),
      relocationWillingness: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Upsert matching preferences
      return ctx.db.matchingPreferences.upsert({
        where: {
          userId,
        },
        update: {
          jobRoles: input.jobRoles,
          skills: input.skills,
          industries: input.industries,
          locations: input.locations,
          remotePreference: input.remotePreference,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          experienceLevels: input.experienceLevels,
          employmentTypes: input.employmentTypes,
          visaSponsorshipNeeded: input.visaSponsorshipNeeded,
          relocationWillingness: input.relocationWillingness,
        },
        create: {
          userId,
          jobRoles: input.jobRoles,
          skills: input.skills,
          industries: input.industries,
          locations: input.locations,
          remotePreference: input.remotePreference,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          experienceLevels: input.experienceLevels,
          employmentTypes: input.employmentTypes,
          visaSponsorshipNeeded: input.visaSponsorshipNeeded,
          relocationWillingness: input.relocationWillingness,
        },
      });
    }),
    
  // Get matched jobs for a user
  getMatchedJobs: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).optional().default(10),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Get user preferences
      const userPreferences = await ctx.db.matchingPreferences.findUnique({
        where: {
          userId,
        },
      });
      
      if (!userPreferences) {
        return {
          items: [],
          nextCursor: null,
        };
      }
      
      // Find jobs matching user preferences
      const jobs = await ctx.db.job.findMany({
        where: {
          OR: [
            { skills: { hasSome: userPreferences.skills } },
            { remote: userPreferences.remotePreference },
            ...(userPreferences.locations.length > 0
              ? [{ location: { in: userPreferences.locations } }]
              : []),
          ],
          visaSponsorship: userPreferences.visaSponsorshipNeeded,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              verified: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit + 1,
        ...(input.cursor
          ? {
              skip: 1,
              cursor: {
                id: input.cursor,
              },
            }
          : {}),
      });
      
      // Calculate match scores
      const jobsWithScores = jobs.slice(0, input.limit).map((job) => {
        // Calculate match score based on various factors
        let matchScore = 0;
        
        // Skills match (most important)
        const skillsMatch = job.skills.filter(skill => 
          userPreferences.skills.includes(skill)
        ).length;
        
        const skillMatchPercentage = job.skills.length > 0
          ? (skillsMatch / job.skills.length) * 100
          : 0;
          
        matchScore += skillMatchPercentage * 0.5; // 50% weight to skills
        
        // Location match
        if (job.remote && userPreferences.remotePreference) {
          matchScore += 20; // Remote preference match
        } else if (job.location && userPreferences.locations.includes(job.location)) {
          matchScore += 15; // Location match
        }
        
        // Visa sponsorship match
        if (job.visaSponsorship === userPreferences.visaSponsorshipNeeded) {
          matchScore += 15;
        }
        
        // Salary match (if available)
        if (job.salary) {
          const salaryValue = parseInt(job.salary.replace(/[^0-9]/g, ''));
          if (salaryValue >= userPreferences.salaryMin && salaryValue <= userPreferences.salaryMax) {
            matchScore += 10;
          }
        }
        
        // Cap at 100
        matchScore = Math.min(matchScore, 100);
        
        return {
          ...job,
          matchScore: Math.round(matchScore),
        };
      });
      
      // Sort by match score
      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      return {
        items: jobsWithScores,
        nextCursor: jobs.length > input.limit ? jobs[input.limit - 1].id : null,
      };
    }),
    
  // Get matched candidates for a job (for employers)
  getMatchedCandidates: protectedProcedure
    .input(z.object({
      jobId: z.string(),
      limit: z.number().min(1).max(100).optional().default(10),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if user is employer or admin
      const user = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });
      
      if (user?.role !== "EMPLOYER" && user?.role !== "ADMIN") {
        throw new Error("Only employers can access candidate matching");
      }
      
      // Get the job details
      const job = await ctx.db.job.findUnique({
        where: {
          id: input.jobId,
        },
        select: {
          skills: true,
          location: true,
          remote: true,
          companyId: true,
          experienceLevel: true,
        },
      });
      
      if (!job) {
        throw new Error("Job not found");
      }
      
      // Check if user is authorized to see this job's candidates
      // TODO: Add proper company-user relationship check here
      
      // Find candidates with matching preferences
      const matchingUsers = await ctx.db.matchingPreferences.findMany({
        where: {
          OR: [
            { skills: { hasSome: job.skills } },
            { remotePreference: job.remote },
            ...(job.location
              ? [{ locations: { has: job.location } }]
              : []),
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
              location: true,
              skills: true,
              verified: true,
            },
          },
        },
        take: input.limit + 1,
        ...(input.cursor
          ? {
              skip: 1,
              cursor: {
                id: input.cursor,
              },
            }
          : {}),
      });
      
      // Calculate match scores
      const candidatesWithScores = matchingUsers.slice(0, input.limit).map((matchPrefs) => {
        // Calculate match score based on various factors
        let matchScore = 0;
        
        // Skills match (most important)
        const skillsMatch = job.skills.filter(skill => 
          matchPrefs.skills.includes(skill)
        ).length;
        
        const skillMatchPercentage = job.skills.length > 0
          ? (skillsMatch / job.skills.length) * 100
          : 0;
          
        matchScore += skillMatchPercentage * 0.5; // 50% weight to skills
        
        // Location match
        if (job.remote && matchPrefs.remotePreference) {
          matchScore += 20; // Remote preference match
        } else if (job.location && matchPrefs.locations.includes(job.location)) {
          matchScore += 15; // Location match
        }
        
        // Experience level match (if available and matchPrefs had this field)
        if (job.experienceLevel && matchPrefs.experienceLevels.includes(job.experienceLevel)) {
          matchScore += 15;
        }
        
        // Cap at 100
        matchScore = Math.min(matchScore, 100);
        
        return {
          user: matchPrefs.user,
          matchScore: Math.round(matchScore),
          matchedSkills: job.skills.filter(skill => matchPrefs.skills.includes(skill)),
        };
      });
      
      // Sort by match score
      candidatesWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      return {
        items: candidatesWithScores,
        nextCursor: matchingUsers.length > input.limit ? matchingUsers[input.limit - 1].id : null,
      };
    }),
});
