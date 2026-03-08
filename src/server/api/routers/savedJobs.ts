import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const savedJobsRouter = createTRPCRouter({
  /** Get all saved job IDs for the current user */
  getSavedJobIds: protectedProcedure.query(async ({ ctx }) => {
    const saved = await ctx.db.savedJob.findMany({
      where: { userId: ctx.session.user.id },
      select: { jobId: true, savedAt: true },
      orderBy: { savedAt: "desc" },
    });
    return saved.map((s) => s.jobId);
  }),

  /** Get full saved jobs with company info */
  getSavedJobs: protectedProcedure.query(async ({ ctx }) => {
    const saved = await ctx.db.savedJob.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        job: {
          include: {
            company: true,
            _count: { select: { applications: true } },
          },
        },
      },
      orderBy: { savedAt: "desc" },
    });
    return saved.map((s) => ({ ...s.job, savedAt: s.savedAt }));
  }),

  /** Save a job */
  save: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.savedJob.upsert({
        where: {
          userId_jobId: {
            userId: ctx.session.user.id,
            jobId: input.jobId,
          },
        },
        create: {
          userId: ctx.session.user.id,
          jobId: input.jobId,
        },
        update: {}, // no-op if already exists
      });
    }),

  /** Unsave a job */
  unsave: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.savedJob.deleteMany({
        where: {
          userId: ctx.session.user.id,
          jobId: input.jobId,
        },
      });
      return { success: true };
    }),

  /** Toggle save status, returns new state */
  toggle: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.db.savedJob.findUnique({
        where: {
          userId_jobId: {
            userId: ctx.session.user.id,
            jobId: input.jobId,
          },
        },
      });

      if (existing) {
        await ctx.db.savedJob.delete({ where: { id: existing.id } });
        return { saved: false };
      } else {
        await ctx.db.savedJob.create({
          data: { userId: ctx.session.user.id, jobId: input.jobId },
        });
        return { saved: true };
      }
    }),
});
