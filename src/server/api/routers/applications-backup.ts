import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const applicationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Check if user has already applied for this job
      const existingApplication = await ctx.db.jobApplication.findUnique({
        where: {
          jobId_userId: {
            jobId: input.jobId,
            userId: userId
          }
        }
      });

      if (existingApplication) {
        throw new Error("You have already applied for this job");
      }

      // Check if job exists
      const job = await ctx.db.job.findUnique({
        where: { id: input.jobId }
      });

      if (!job) {
        throw new Error("Job not found");
      }

      return await ctx.db.jobApplication.create({
        data: {
          jobId: input.jobId,
          userId: userId,
          status: ApplicationStatus.PENDING
        },
        include: {
          job: {
            include: {
              companyRelation: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    }),

  getByUser: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(ApplicationStatus).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { status, limit, cursor } = input;

      const applications = await ctx.db.jobApplication.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          userId: userId,
          ...(status && { status })
        },
        include: {
          job: {
            include: {
              companyRelation: true
            }
          }
        },
        orderBy: {
          appliedAt: "desc"
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (applications.length > limit) {
        const nextItem = applications.pop();
        nextCursor = nextItem!.id;
      }

      return {
        applications,
        nextCursor,
      };
    }),

  getByJob: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        status: z.nativeEnum(ApplicationStatus).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { jobId, status, limit, cursor } = input;

      const applications = await ctx.db.jobApplication.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          jobId: jobId,
          ...(status && { status })
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              profileComplete: true,
              createdAt: true
            }
          },
          job: {
            select: {
              id: true,
              title: true,
              company: true
            }
          }
        },
        orderBy: {
          appliedAt: "desc"
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (applications.length > limit) {
        const nextItem = applications.pop();
        nextCursor = nextItem!.id;
      }

      return {
        applications,
        nextCursor,
      };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        status: z.nativeEnum(ApplicationStatus),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { applicationId, status } = input;

      return await ctx.db.jobApplication.update({
        where: { id: applicationId },
        data: { status },
        include: {
          job: {
            include: {
              companyRelation: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    }),

  getApplicationStatus: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const application = await ctx.db.jobApplication.findUnique({
        where: {
          jobId_userId: {
            jobId: input.jobId,
            userId: userId
          }
        },
        select: {
          id: true,
          status: true,
          appliedAt: true
        }
      });

      return application;
    }),

  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const [total, pending, reviewed, rejected] = await Promise.all([
        ctx.db.jobApplication.count({
          where: { userId }
        }),
        ctx.db.jobApplication.count({
          where: { userId, status: ApplicationStatus.PENDING }
        }),
        ctx.db.jobApplication.count({
          where: { userId, status: ApplicationStatus.REVIEWED }
        }),
        ctx.db.jobApplication.count({
          where: { userId, status: ApplicationStatus.REJECTED }
        })
      ]);

      return {
        total,
        pending,
        reviewed,
        rejected
      };
    }),

  delete: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Verify the application belongs to the user
      const application = await ctx.db.jobApplication.findUnique({
        where: { id: input.applicationId }
      });

      if (!application) {
        throw new Error("Application not found");
      }

      if (application.userId !== userId) {
        throw new Error("Unauthorized");
      }

      return await ctx.db.jobApplication.delete({
        where: { id: input.applicationId }
      });
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

        // Use any type to work around Prisma client issues
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
        // Return empty result if database query fails
        return {
          applications: [],
          nextCursor: undefined,
        };
      }
    }),
});
