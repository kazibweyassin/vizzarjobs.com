import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "~/server/api/trpc";
import { JobType, ExperienceLevel } from "@prisma/client";
import { RemoteOKImporter } from "~/lib/job-import/remoteok";

export const jobsRouter = createTRPCRouter({
  getCount: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.job.count();
    const featured = await ctx.db.job.count({
      where: { featured: true }
    });
    const premium = await ctx.db.job.count({
      where: { premium: true }
    });
    return { count: total, featured, premium };
  }),

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
      try {
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
                { description: { contains: search, mode: "insensitive" } }
              ]
            } : {},
            postedWithin && postedWithin !== 'any' ? dateFilter : {},
            (salaryMin !== undefined || salaryMax !== undefined) ? salaryFilter : {}
          ]
        },
        include: {
          company: true,
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
      } catch (error) {
        return {
          jobs: [],
          nextCursor: undefined,
        };
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const job = await ctx.db.job.findUnique({
        where: { id: input.id },
        include: {
          company: true,
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
          title: input.title,
          description: input.description,
          requirements: input.requirements,
          location: input.location,
          country: input.country,
          visaSponsorship: input.visaSponsorship,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          jobType: input.jobType,
          experienceLevel: input.experienceLevel,
          techStack: input.techStack,
          applicationUrl: input.applicationUrl,
          companyId: input.companyId,
        },
        include: {
          company: true
        }
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
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
          company: true
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
      try {
        return await ctx.db.job.findMany({
          take: input.limit,
          where: {
            visaSponsorship: true // Featured jobs are visa-sponsored jobs
          },
          include: {
            company: true
          },
          orderBy: {
            createdAt: "desc"
          }
        });
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
        // Return empty array if database is unavailable
        return [];
      }
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
          company: true,
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
    

  getRecommended: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;
        
        // Find jobs based on user's profile and previous applications
        const jobs = await ctx.db.job.findMany({
          where: {},
          include: {
            _count: {
              select: {
                applications: true
              }
            },
            company: true
          },
          orderBy: [
            { createdAt: "desc" }
          ],
          take: input.limit
        });
        
        return jobs;
      } catch (error) {
        console.error("Error getting recommended jobs:", error);
        return [];
      }
    }),

  getPopular: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(async ({ input, ctx }) => {
      try {
        const jobs = await ctx.db.job.findMany({
          where: {},
          include: {
            _count: {
              select: {
                applications: true
              }
            },
            company: true
          },
          orderBy: [
            { createdAt: "desc" }
          ],
          take: input.limit
        });
        
        return jobs;
      } catch (error) {
        console.error("Error getting popular jobs:", error);
        return [];
      }
    }),
    
  getByCompany: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // Only allow employers to see their own company's jobs
        if (ctx.session.user.role !== "EMPLOYER" && ctx.session.user.role !== "ADMIN") {
          throw new Error("Unauthorized: Only employers can view their jobs");
        }
        
        const jobs = await ctx.db.job.findMany({
          where: {
            companyId: input.companyId
          },
          include: {
            company: true,
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
        
        return jobs;
      } catch (error) {
        console.error("Error getting company jobs:", error);
        throw error;
      }
    }),

  // Get premium jobs (requires premium subscription)
  getPremiumJobs: protectedProcedure
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
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Check if user has premium access
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id }
        });

        // Get active subscription separately
        const activeSubscription = await ctx.db.subscription.findFirst({
          where: {
            userId: ctx.session.user.id,
            status: "ACTIVE"
          },
          orderBy: { createdAt: "desc" }
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Check premium access
        const hasPremiumAccess = user.premium || 
          (activeSubscription && activeSubscription.planId !== "basic");

        if (!hasPremiumAccess) {
          throw new Error("Premium subscription required to access premium jobs");
        }

        const { 
          location, 
          visaSponsorship, 
          techStack, 
          jobType, 
          experienceLevel, 
          search,
          salaryMin,
          salaryMax,
          limit,
          cursor
        } = input;

        const where: any = {
          premium: true, // Only premium jobs
        };

        if (location) {
          where.location = {
            contains: location,
            mode: 'insensitive'
          };
        }

        if (visaSponsorship !== undefined) {
          where.visaSponsorship = visaSponsorship;
        }

        if (techStack && techStack.length > 0) {
          where.techStack = {
            hasSome: techStack
          };
        }

        if (jobType) {
          where.jobType = jobType;
        }

        if (experienceLevel) {
          where.experienceLevel = experienceLevel;
        }

        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { company: { name: { contains: search, mode: 'insensitive' } } }
          ];
        }

        if (salaryMin || salaryMax) {
          where.AND = [];
          if (salaryMin) {
            where.AND.push({ salaryMin: { gte: salaryMin } });
          }
          if (salaryMax) {
            where.AND.push({ salaryMax: { lte: salaryMax } });
          }
        }

        const jobs = await ctx.db.job.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          where,
          include: {
            company: true,
            _count: {
              select: { applications: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (jobs.length > limit) {
          const nextItem = jobs.pop();
          nextCursor = nextItem?.id;
        }

        return {
          jobs,
          nextCursor
        };
      } catch (error) {
        console.error("Error fetching premium jobs:", error);
        throw error;
      }
    }),

  // Import jobs from RemoteOK
  importFromRemoteOK: adminProcedure
    .mutation(async ({ ctx }) => {
      try {
        const importer = new RemoteOKImporter();
        const jobs = await importer.importJobs();
        
        const createdJobs = [];
        const errors = [];
        
        for (const jobData of jobs) {
          try {
            // Check if job already exists
            const existingJob = await ctx.db.job.findFirst({
              where: {
                title: jobData.title,
                company: {
                  name: jobData.company
                }
              }
            });
            
            if (existingJob) {
              console.log(`Job already exists: ${jobData.title} at ${jobData.company}`);
              continue;
            }
            
            // Find or create company
            let company = await ctx.db.company.findFirst({
              where: { name: jobData.company }
            });
            
            if (!company) {
              company = await ctx.db.company.create({
                data: {
                  name: jobData.company,
                  description: `Company imported from RemoteOK`,
                  website: jobData.applicationUrl.includes('http') ? jobData.applicationUrl : undefined,
                  verified: true,
                  verificationStatus: 'APPROVED'
                }
              });
            }
            
            // Create job
            const job = await ctx.db.job.create({
              data: {
                title: jobData.title,
                description: jobData.description,
                companyId: company.id,
                location: jobData.location,
                country: jobData.country,
                jobType: jobData.jobType as JobType,
                experienceLevel: jobData.experienceLevel as ExperienceLevel,
                salaryMin: jobData.salaryMin,
                salaryMax: jobData.salaryMax,
                visaSponsorship: jobData.visaSponsorship,
                remote: jobData.remote,
                applicationUrl: jobData.applicationUrl,
                requirements: jobData.requirements,
                skills: jobData.skills,
                techStack: jobData.techStack,
                featured: false,
                premium: false
              }
            });
            
            createdJobs.push(job);
            console.log(`Created job: ${job.title} at ${company.name}`);
            
          } catch (error) {
            console.error(`Error creating job ${jobData.title}:`, error);
            errors.push({
              job: jobData.title,
              company: jobData.company,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
        
        return {
          success: true,
          imported: createdJobs.length,
          total: jobs.length,
          errors: errors.length > 0 ? errors : undefined,
          jobs: createdJobs
        };
        
      } catch (error) {
        console.error('Error importing jobs from RemoteOK:', error);
        throw new Error(`Failed to import jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
