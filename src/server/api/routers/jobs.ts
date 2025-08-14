import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { JobType, ExperienceLevel } from "@prisma/client";

export const jobsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        location: z.string().optional(),
        visaSponsorship: z.boolean().optional(),
        techStack: z.array(z.string()).optional(),
        jobType: z.nativeEnum(JobType).optional(),
        experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
        search: z.string().optional(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        postedWithin: z.enum(['day', 'week', 'month', 'any']).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { 
        location, 
        visaSponsorship, 
        techStack, 
        jobType, 
        experienceLevel, 
        search,
        salaryMin,
        salaryMax,
        postedWithin,
        limit, 
        cursor 
      } = input;

      // Calculate date filters based on postedWithin
      let dateFilter = {};
      if (postedWithin) {
        const now = new Date();
        let dateThreshold = new Date();
        
        switch (postedWithin) {
          case 'day':
            dateThreshold.setDate(now.getDate() - 1);
            break;
          case 'week':
            dateThreshold.setDate(now.getDate() - 7);
            break;
          case 'month':
            dateThreshold.setMonth(now.getMonth() - 1);
            break;
          case 'any':
          default:
            // No date filter
            break;
        }
        
        if (postedWithin !== 'any') {
          dateFilter = {
            createdAt: {
              gte: dateThreshold
            }
          };
        }
      }
      
      // Create salary filters
      let salaryFilter = {};
      if (salaryMin !== undefined || salaryMax !== undefined) {
        if (salaryMin !== undefined && salaryMax !== undefined) {
          // Jobs where range overlaps with filtered range
          salaryFilter = {
            OR: [
              // Job max salary is within our range
              {
                salaryMax: {
                  gte: salaryMin,
                  ...(salaryMax ? { lte: salaryMax } : {})
                }
              },
              // Job min salary is within our range
              {
                salaryMin: {
                  ...(salaryMin ? { gte: salaryMin } : {}),
                  lte: salaryMax
                }
              },
              // Our range is within job's range
              {
                AND: [
                  { salaryMin: { lte: salaryMin } },
                  { salaryMax: { gte: salaryMax } }
                ]
              }
            ]
          };
        } else if (salaryMin !== undefined) {
          // Only min salary specified
          salaryFilter = {
            OR: [
              { salaryMin: { gte: salaryMin } },
              { salaryMax: { gte: salaryMin } }
            ]
          };
        } else if (salaryMax !== undefined) {
          // Only max salary specified
          salaryFilter = {
            OR: [
              { salaryMax: { lte: salaryMax } },
              { salaryMin: { lte: salaryMax } }
            ]
          };
        }
      }

      const jobs = await ctx.db.job.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          AND: [
            location ? {
              OR: [
                { location: { contains: location, mode: "insensitive" } },
                { country: { contains: location, mode: "insensitive" } }
              ]
            } : {},
            visaSponsorship !== undefined ? { visaSponsorship } : {},
            techStack && techStack.length > 0 ? {
              techStack: {
                hasSome: techStack
              }
            } : {},
            jobType ? { jobType } : {},
            experienceLevel ? { experienceLevel } : {},
            search ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
              ]
            } : {},
            postedWithin && postedWithin !== 'any' ? dateFilter : {},
            (salaryMin !== undefined || salaryMax !== undefined) ? salaryFilter : {}
          ]
        },
        include: {
          companyRelation: true,
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (jobs.length > limit) {
        const nextItem = jobs.pop();
        nextCursor = nextItem!.id;
      }

      return {
        jobs,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const job = await ctx.db.job.findUnique({
        where: { id: input.id },
        include: {
          companyRelation: true,
          _count: {
            select: {
              applications: true
            }
          }
        }
      });

      if (!job) {
        throw new Error("Job not found");
      }

      return job;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        company: z.string().min(1),
        description: z.string().min(1),
        requirements: z.array(z.string()),
        location: z.string().min(1),
        country: z.string().min(1),
        visaSponsorship: z.boolean().default(false),
        salaryMin: z.number().positive().optional(),
        salaryMax: z.number().positive().optional(),
        jobType: z.nativeEnum(JobType),
        experienceLevel: z.nativeEnum(ExperienceLevel),
        techStack: z.array(z.string()),
        applicationUrl: z.string().url(),
        companyId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Validate salary range
      if (input.salaryMin && input.salaryMax && input.salaryMin > input.salaryMax) {
        throw new Error("Minimum salary cannot be greater than maximum salary");
      }

      return await ctx.db.job.create({
        data: {
          ...input,
        },
        include: {
          companyRelation: true
        }
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        company: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        requirements: z.array(z.string()).optional(),
        location: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
        visaSponsorship: z.boolean().optional(),
        salaryMin: z.number().positive().optional(),
        salaryMax: z.number().positive().optional(),
        jobType: z.nativeEnum(JobType).optional(),
        experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
        techStack: z.array(z.string()).optional(),
        applicationUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      // Validate salary range if both are provided
      if (updateData.salaryMin && updateData.salaryMax && updateData.salaryMin > updateData.salaryMax) {
        throw new Error("Minimum salary cannot be greater than maximum salary");
      }

      return await ctx.db.job.update({
        where: { id },
        data: updateData,
        include: {
          companyRelation: true
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.job.delete({
        where: { id: input.id }
      });
    }),

  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.job.findMany({
        take: input.limit,
        where: {
          visaSponsorship: true // Featured jobs are visa-sponsored jobs
        },
        include: {
          companyRelation: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    }),

  getTechStacks: publicProcedure
    .query(async ({ ctx }) => {
      const jobs = await ctx.db.job.findMany({
        select: {
          techStack: true
        }
      });

      const allTechStacks = jobs.flatMap(job => job.techStack);
      const uniqueTechStacks = [...new Set(allTechStacks)].sort();

      return uniqueTechStacks;
    }),

  getLocations: publicProcedure
    .query(async ({ ctx }) => {
      const jobs = await ctx.db.job.findMany({
        select: {
          location: true,
          country: true
        }
      });

      const allLocations = jobs.flatMap(job => [job.location, job.country]);
      const uniqueLocations = [...new Set(allLocations.filter(Boolean))].sort();

      return uniqueLocations;
    }),
    
  getByIds: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string())
      })
    )
    .query(async ({ input, ctx }) => {
      // Return empty array if no IDs provided
      if (input.ids.length === 0) return [];
      
      const jobs = await ctx.db.job.findMany({
        where: {
          id: {
            in: input.ids
          }
        },
        include: {
          companyRelation: true,
          _count: {
            select: {
              applications: true
            }
          }
        }
      });
      
      // Sort results by the order of ids provided
      return jobs.sort((a, b) => {
        return input.ids.indexOf(a.id) - input.ids.indexOf(b.id);
      });
    }),
});
