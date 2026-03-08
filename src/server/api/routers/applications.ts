import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const applicationsRouter = createTRPCRouter({
  applyToJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;

        // Check if already applied
        const existingApplication = await ctx.db.application.findUnique({
          where: {
            userId_jobId: {
              userId: userId,
              jobId: input.jobId,
            },
          },
        });

        if (existingApplication) {
          throw new Error("You have already applied to this job");
        }

        // Check if job exists
        const job = await ctx.db.job.findUnique({
          where: { id: input.jobId },
        });

        if (!job) {
          throw new Error("Job not found");
        }

        return await ctx.db.application.create({
          data: {
            userId: userId,
            jobId: input.jobId,
            status: "PENDING"
          },
        });
      } catch (error) {
        console.error("Error applying to job:", error);
        throw error;
      }
    }),

  getApplicationsByJob: publicProcedure
    .input(
      z.object({
        jobId: z.string(),
        status: z.enum(["PENDING", "REVIEWED", "REJECTED"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        
        const applications = await ctx.db.application.findMany({
          take: input.limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          where: {
            jobId: input.jobId,
            ...(input.status && { status: input.status }),
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            appliedAt: "desc",
          },
        });

        let nextCursor: typeof input.cursor | undefined = undefined;
        if (applications.length > input.limit) {
          const nextItem = applications.pop();
          nextCursor = nextItem?.id;
        }

        return {
          applications,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching job applications:", error);
        return {
          applications: [],
          nextCursor: undefined,
        };
      }
    }),

  /** Get the application status for a single job for the current user */
  getApplicationStatus: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input, ctx }) => {
      const application = await ctx.db.application.findUnique({
        where: {
          userId_jobId: {
            userId: ctx.session.user.id,
            jobId: input.jobId,
          },
        },
        select: { status: true, appliedAt: true },
      });
      return application ?? null;
    }),

  getMyApplications: protectedProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "REVIEWED", "REJECTED"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;
        
        const applications = await ctx.db.application.findMany({
          take: input.limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          where: {
            userId: userId,
            ...(input.status && { status: input.status }),
          },
          include: {
            job: {
              include: {
                companyRelation: {
                  select: {
                    name: true,
                    logo: true,
                  },
                },
              },
            },
          },
          orderBy: {
            appliedAt: "desc",
          },
        });

        let nextCursor: typeof input.cursor | undefined = undefined;
        if (applications.length > input.limit) {
          const nextItem = applications.pop();
          nextCursor = nextItem?.id;
        }

        return {
          applications,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching applications:", error);
        return {
          applications: [],
          nextCursor: undefined,
        };
      }
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        status: z.enum(["PENDING", "REVIEWED", "REJECTED"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        
        return await ctx.db.application.update({
          where: { id: input.applicationId },
          data: { status: input.status },
        });
      } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
      }
    }),

  getApplicationById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        
        const application = await ctx.db.application.findUnique({
          where: { id: input.id },
          include: {
            job: {
              include: {
                companyRelation: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        });

        return application;
      } catch (error) {
        console.error("Error fetching application:", error);
        return null;
      }
    }),

  getApplicationStats: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.session.user.id;

        const [total, pending, reviewed, rejected] = await Promise.all([
          ctx.db.application.count({
            where: { userId }
          }),
          ctx.db.application.count({
            where: { userId, status: "PENDING" }
          }),
          ctx.db.application.count({
            where: { userId, status: "REVIEWED" }
          }),
          ctx.db.application.count({
            where: { userId, status: "REJECTED" }
          }),
        ]);

        return {
          total,
          pending,
          reviewed,
          rejected,
        };
      } catch (error) {
        console.error("Error fetching application stats:", error);
        return {
          total: 0,
          pending: 0,
          reviewed: 0,
          rejected: 0,
        };
      }
    }),

  deleteApplication: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;

        const application = await ctx.db.application.findUnique({
          where: { id: input.id },
        });

        if (!application || application.userId !== userId) {
          throw new Error("Application not found or unauthorized");
        }

        return await ctx.db.application.delete({
          where: { id: input.id },
        });
      } catch (error) {
        console.error("Error deleting application:", error);
        throw error;
      }
    }),

  getByJobId: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // First, get the job to check if the user owns it
        const job = await ctx.db.job.findUnique({
          where: { id: input.jobId },
          include: { company: true }
        });

        if (!job) {
          throw new Error("Job not found");
        }

        // Check if the user is the employer of this job
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: { employee: { include: { company: true } } }
        });

        if (!user?.employee?.company || user.employee.company.id !== job.companyId) {
          throw new Error("Unauthorized: You can only view applications for your own company's jobs");
        }

        // Fetch applications for this job
        const applications = await ctx.db.application.findMany({
          where: { jobId: input.jobId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                location: true,
                resume: true,
                bio: true,
                skills: true,
                website: true,
                githubUrl: true,
                linkedinUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return applications;
      } catch (error) {
        console.error("Error fetching applications by job ID:", error);
        throw error;
      }
    }),

  updateStatus: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      status: z.enum(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"])
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // First, get the application to check ownership
        const application = await ctx.db.application.findUnique({
          where: { id: input.id },
          include: {
            job: {
              include: { company: true }
            }
          }
        });

        if (!application) {
          throw new Error("Application not found");
        }

        // Check if the user is the employer of this job
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          include: { employee: { include: { company: true } } }
        });

        if (!user?.employee?.company || user.employee.company.id !== application.job.companyId) {
          throw new Error("Unauthorized: You can only update applications for your own company's jobs");
        }

        // Update the application status
        return await ctx.db.application.update({
          where: { id: input.id },
          data: { status: input.status },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                location: true,
                resume: true,
                bio: true,
                skills: true,
                website: true,
                githubUrl: true,
                linkedinUrl: true,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
      }
    }),
});
