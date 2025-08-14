import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const companiesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        industry: z.string().optional(),
        location: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { search, industry, location, limit, cursor } = input;

      const companies = await ctx.db.company.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          AND: [
            search ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { industry: { contains: search, mode: "insensitive" } }
              ]
            } : {},
            industry ? { industry: { contains: industry, mode: "insensitive" } } : {},
            location ? { location: { contains: location, mode: "insensitive" } } : {},
          ]
        },
        include: {
          _count: {
            select: {
              jobs: true
            }
          }
        },
        orderBy: {
          name: "asc"
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (companies.length > limit) {
        const nextItem = companies.pop();
        nextCursor = nextItem!.id;
      }

      return {
        companies,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const company = await ctx.db.company.findUnique({
        where: { id: input.id },
        include: {
          jobs: {
            include: {
              _count: {
                select: {
                  applications: true
                }
              }
            },
            orderBy: {
              createdAt: "desc"
            }
          },
          _count: {
            select: {
              jobs: true
            }
          }
        }
      });

      if (!company) {
        throw new Error("Company not found");
      }

      return company;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        website: z.string().url().optional(),
        logo: z.string().url().optional(),
        size: z.string().optional(),
        industry: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.company.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        website: z.string().url().optional(),
        logo: z.string().url().optional(),
        size: z.string().optional(),
        industry: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      return await ctx.db.company.update({
        where: { id },
        data: updateData,
      });
    }),

  getJobsByCompany: publicProcedure
    .input(
      z.object({
        companyId: z.string(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { companyId, limit, cursor } = input;

      const jobs = await ctx.db.job.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          companyId: companyId
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

  getIndustries: publicProcedure
    .query(async ({ ctx }) => {
      const companies = await ctx.db.company.findMany({
        select: {
          industry: true
        },
        where: {
          industry: {
            not: null
          }
        }
      });

      const industries = companies
        .map(company => company.industry)
        .filter(Boolean) as string[];
      
      const uniqueIndustries = [...new Set(industries)].sort();

      return uniqueIndustries;
    }),

  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(8) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.company.findMany({
        take: input.limit,
        include: {
          _count: {
            select: {
              jobs: true
            }
          }
        },
        orderBy: {
          jobs: {
            _count: "desc"
          }
        }
      });
    }),
});
