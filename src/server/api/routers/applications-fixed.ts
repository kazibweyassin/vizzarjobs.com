import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const applicationsRouter = createTRPCRouter({
  applyToJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;
        const db = ctx.db as any;

        // Check if already applied
        const existingApplication = await db.jobApplication.findUnique({
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
        const job = await db.job.findUnique({
          where: { id: input.jobId },
        });

        if (!job) {
          throw new Error("Job not found");
        }

        return await db.jobApplication.create({
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
        const db = ctx.db as any;
        
        const applications = await db.jobApplication.findMany({
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
        const db = ctx.db as any;
        
        const applications = await db.jobApplication.findMany({
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
        const db = ctx.db as any;
        
        return await db.jobApplication.update({
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
        const db = ctx.db as any;
        
        const application = await db.jobApplication.findUnique({
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
        const db = ctx.db as any;

        const [total, pending, reviewed, rejected] = await Promise.all([
          db.jobApplication.count({
            where: { userId }
          }),
          db.jobApplication.count({
            where: { userId, status: "PENDING" }
          }),
          db.jobApplication.count({
            where: { userId, status: "REVIEWED" }
          }),
          db.jobApplication.count({
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
        const db = ctx.db as any;

        const application = await db.jobApplication.findUnique({
          where: { id: input.id },
        });

        if (!application || application.userId !== userId) {
          throw new Error("Application not found or unauthorized");
        }

        return await db.jobApplication.delete({
          where: { id: input.id },
        });
      } catch (error) {
        console.error("Error deleting application:", error);
        throw error;
      }
    }),
});
