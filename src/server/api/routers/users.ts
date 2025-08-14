import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  updateRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
        profileComplete: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            role: input.role,
            profileComplete: input.profileComplete,
          },
        });

        return updatedUser;
      } catch (error) {
        console.error("❌ Database update failed:", error);
        throw error;
      }
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }),
});
