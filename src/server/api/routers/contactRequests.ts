import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const contactRequestsRouter = createTRPCRouter({
  getCount: publicProcedure
    .query(async ({ ctx }) => {
      const [total, pending] = await Promise.all([
        ctx.db.contactRequest.count(),
        ctx.db.contactRequest.count({
          where: {
            status: "PENDING"
          }
        })
      ]);

      return {
        count: total,
        pending
      };
    }),
});
