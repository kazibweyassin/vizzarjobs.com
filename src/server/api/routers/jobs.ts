import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "~/server/api/trpc";
import { JobType, ExperienceLevel } from "@prisma/client";
import { RemoteOKImporter } from "~/lib/job-import/remoteok";
import { RapidAPIImporter } from "~/lib/job-import/rapidapi";

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
        jobs: jobs.map(job => ({
          ...job,
          _count: {
            applications: 0 // Hide application count for privacy
          }
        })),
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

      // If user is logged in, check if they can see application details
      if (ctx.session?.user) {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: {
            employee: {
              include: {
                company: true
              }
            }
          }
        });

        // If user is an employer/admin from the same company, include application details
        if (user?.employee?.company?.id === job.companyId && 
            ctx.session?.user && (ctx.session.user.role === "EMPLOYER" || ctx.session.user.role === "ADMIN")) {
          return job;
        }
      }

      // For public access or users from other companies, exclude application details
      return {
        ...job,
        _count: {
          applications: 0 // Hide application count for privacy
        }
      };
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



  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(async ({ input, ctx }) => {
      try {
        const jobs = await ctx.db.job.findMany({
          take: input.limit,
          where: {
            // Show all jobs, not just visa-sponsored ones
          },
          include: {
            company: true
          },
          orderBy: {
            createdAt: "desc"
          }
        });
        
        // Hide application counts for privacy
        return jobs.map(job => ({
          ...job,
          _count: {
            applications: 0
          }
        }));
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
        // Return empty array if database is unavailable
        return [];
      }
    }),

  // Employer CRUD Operations
  getByEmployer: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        // Get user's company through employee relationship
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: {
            employee: {
              include: {
                company: true
              }
            }
          }
        });

        if (!user?.employee?.company) {
          throw new Error("User is not associated with a company");
        }

        return await ctx.db.job.findMany({
          where: {
            companyId: user.employee.company.id
          },
          include: {
            company: true,
            applications: {
              select: {
                id: true,
                status: true,
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        });
      } catch (error) {
        console.error('Error fetching employer jobs:', error);
        throw new Error("Failed to fetch your jobs");
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Job title is required"),
        description: z.string().min(1, "Job description is required"),
        location: z.string().min(1, "Location is required"),
        country: z.string().optional(),
        jobType: z.nativeEnum(JobType),
        experienceLevel: z.nativeEnum(ExperienceLevel),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        visaSponsorship: z.boolean().default(false),
        remote: z.boolean().default(false),
        applicationUrl: z.string().url("Valid application URL is required"),
        requirements: z.array(z.string()).default([]),
        skills: z.array(z.string()).default([]),
        techStack: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        premium: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify user owns this job
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: {
            employee: {
              include: {
                company: true
              }
            }
          }
        });

        if (!user?.employee?.company) {
          throw new Error("User is not associated with a company");
        }

        const existingJob = await ctx.db.job.findFirst({
          where: {
            id: input.id,
            companyId: user.employee.company.id
          }
        });

        if (!existingJob) {
          throw new Error("Job not found or you don't have permission to edit it");
        }

        const updatedJob = await ctx.db.job.update({
          where: { id: input.id },
          data: {
            title: input.title,
            description: input.description,
            location: input.location,
            country: input.country,
            jobType: input.jobType,
            experienceLevel: input.experienceLevel,
            salaryMin: input.salaryMin,
            salaryMax: input.salaryMax,
            visaSponsorship: input.visaSponsorship,
            remote: input.remote,
            applicationUrl: input.applicationUrl,
            requirements: input.requirements,
            skills: input.skills,
            techStack: input.techStack,
            featured: input.featured,
            premium: input.premium,
            updatedAt: new Date(),
          },
          include: {
            company: true
          }
        });

        return updatedJob;
      } catch (error) {
        console.error('Error updating job:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to update job");
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify user owns this job
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: {
            employee: {
              include: {
                company: true
              }
            }
          }
        });

        if (!user?.employee?.company) {
          throw new Error("User is not associated with a company");
        }

        const existingJob = await ctx.db.job.findFirst({
          where: {
            id: input.id,
            companyId: user.employee.company.id
          }
        });

        if (!existingJob) {
          throw new Error("Job not found or you don't have permission to delete it");
        }

        // Delete the job
        await ctx.db.job.delete({
          where: { id: input.id }
        });

        return { success: true, message: "Job deleted successfully" };
      } catch (error) {
        console.error('Error deleting job:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to delete job");
      }
    }),

  getJobApplications: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // Verify user is an employer/admin
        if (ctx.session.user.role !== "EMPLOYER" && ctx.session.user.role !== "ADMIN") {
          throw new Error("Unauthorized: Only employers can view job applications");
        }

        // Get user's company
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: {
            employee: {
              include: {
                company: true
              }
            }
          }
        });

        if (!user?.employee?.company) {
          throw new Error("User is not associated with a company");
        }

        // Verify the job belongs to the user's company
        const job = await ctx.db.job.findFirst({
          where: {
            id: input.jobId,
            companyId: user.employee.company.id
          }
        });

        if (!job) {
          throw new Error("Job not found or you don't have permission to view its applications");
        }

        // Get applications for this job
        const applications = await ctx.db.application.findMany({
          where: {
            jobId: input.jobId
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                jobSeekerProfile: {
                  select: {
                    title: true,
                    bio: true,
                    skills: true,
                    technicalSkills: true,
                    yearsOfExperience: true,
                    location: true
                  }
                }
              }
            }
          },
          orderBy: {
            id: "desc"
          }
        });

        return applications;
      } catch (error) {
        console.error('Error fetching job applications:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to fetch applications");
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
      
      // If user is logged in, check if they can see application details
      if (ctx.session?.user) {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: {
            employee: {
              include: {
                company: true
              }
            }
          }
        });

        // Filter jobs based on user's company access
        const filteredJobs = jobs.map(job => {
          // If user is an employer/admin from the same company, include application details
          if (user?.employee?.company?.id === job.companyId && 
              ctx.session?.user && (ctx.session.user.role === "EMPLOYER" || ctx.session.user.role === "ADMIN")) {
            return job;
          }
          
          // For other companies or public access, hide application details
          return {
            ...job,
            _count: {
              applications: 0
            }
          };
        });
        
        // Sort results by the order of ids provided
        return filteredJobs.sort((a, b) => {
          return input.ids.indexOf(a.id) - input.ids.indexOf(b.id);
        });
      }
      
      // For public access, hide application details for all jobs
      const publicJobs = jobs.map(job => ({
        ...job,
        _count: {
          applications: 0
        }
      }));
      
      // Sort results by the order of ids provided
      return publicJobs.sort((a, b) => {
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
        
        // Verify user belongs to the company they're trying to access
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: {
            employee: {
              include: {
                company: true
              }
            }
          }
        });

        if (!user?.employee?.company) {
          throw new Error("User is not associated with a company");
        }

        // Only allow access to their own company's jobs (unless admin)
        if (ctx.session.user.role !== "ADMIN" && user.employee.company.id !== input.companyId) {
          throw new Error("Unauthorized: You can only view your own company's jobs");
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

  // Import jobs from RapidAPI
  importFromRapidAPI: adminProcedure
    .input(
      z.object({
        apiKey: z.string().optional(),
        endpoint: z.string().optional(),
        query: z.string().optional(),
        location: z.string().optional(),
        numPages: z.number().min(1).max(10).default(3),
        jobType: z.string().optional(),
        experienceLevel: z.string().optional(),
        remote: z.boolean().optional(),
        visaSponsorship: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const importer = new RapidAPIImporter(input.apiKey);
        
        if (input.endpoint) {
          importer.setEndpoint(input.endpoint);
        }
        
        const jobs = await importer.fetchJobs({
          query: input.query || 'software engineer developer',
          location: input.location || 'United States',
          num_pages: input.numPages,
          job_type: input.jobType,
          experience_level: input.experienceLevel,
          remote: input.remote,
          visa_sponsorship: input.visaSponsorship,
        });
        
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
                  description: `Company imported from RapidAPI`,
                  website: jobData.application_url?.includes('http') ? jobData.application_url : undefined,
                  verified: true,
                  verificationStatus: 'APPROVED'
                }
              });
            }
            
            // Parse the job data
            const parsedJob = importer.parseJob(jobData);
            
            // Create job
            const job = await ctx.db.job.create({
              data: {
                title: parsedJob.title,
                description: parsedJob.description,
                companyId: company.id,
                location: parsedJob.location,
                country: parsedJob.country,
                jobType: parsedJob.jobType as JobType,
                experienceLevel: parsedJob.experienceLevel as ExperienceLevel,
                salaryMin: parsedJob.salaryMin,
                salaryMax: parsedJob.salaryMax,
                visaSponsorship: parsedJob.visaSponsorship,
                remote: parsedJob.remote,
                applicationUrl: parsedJob.applicationUrl,
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
        console.error('Error importing jobs from RapidAPI:', error);
        throw new Error(`Failed to import jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
