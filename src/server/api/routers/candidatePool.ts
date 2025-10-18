import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "~/server/api/trpc";
import { CandidateStatus, EducationLevel } from "@prisma/client";

export const candidatePoolRouter = createTRPCRouter({
  // Public procedure for candidate registration
  create: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Valid email is required"),
        phoneNumber: z.string().optional(),
        country: z.string().min(1, "Country is required"),
        profession: z.string().min(1, "Profession is required"),
        skills: z.array(z.string()).default([]),
        yearsOfExperience: z.number().min(0, "Years of experience must be 0 or more"),
        educationLevel: z.nativeEnum(EducationLevel),
        preferredDestination: z.array(z.string()).default([]),
        needsVisaSponsorship: z.boolean().default(false),
        cvFilePath: z.string().optional(),
        jobAlerts: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if email already exists
        const existingCandidate = await ctx.db.candidatePool.findUnique({
          where: { email: input.email }
        });

        if (existingCandidate) {
          throw new Error("A candidate with this email already exists");
        }

        const candidate = await ctx.db.candidatePool.create({
          data: {
            fullName: input.fullName,
            email: input.email,
            phoneNumber: input.phoneNumber,
            country: input.country,
            profession: input.profession,
            skills: input.skills,
            yearsOfExperience: input.yearsOfExperience,
            educationLevel: input.educationLevel,
            preferredDestination: input.preferredDestination,
            needsVisaSponsorship: input.needsVisaSponsorship,
            cvFilePath: input.cvFilePath,
            jobAlerts: input.jobAlerts,
            status: "ACTIVE",
          }
        });

        return {
          success: true,
          message: "Thank you for joining VizzarJobs Talent Pool! We'll contact you when matching opportunities arise.",
          candidateId: candidate.id
        };
      } catch (error) {
        console.error('Error creating candidate:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to register candidate");
      }
    }),

  // Admin procedure to get all candidates with filters
  getAll: adminProcedure
    .input(
      z.object({
        profession: z.string().optional(),
        destination: z.string().optional(),
        needsVisaSponsorship: z.boolean().optional(),
        status: z.nativeEnum(CandidateStatus).optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const {
          profession,
          destination,
          needsVisaSponsorship,
          status,
          search,
          limit,
          cursor
        } = input;

        const whereClause = {
          AND: [
            profession ? { profession: { contains: profession, mode: "insensitive" as const } } : {},
            destination ? { preferredDestination: { has: destination } } : {},
            needsVisaSponsorship !== undefined ? { needsVisaSponsorship } : {},
            status ? { status } : {},
            search ? {
              OR: [
                { fullName: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
                { profession: { contains: search, mode: "insensitive" as const } },
                { skills: { hasSome: [search] } }
              ]
            } : {}
          ]
        };

        const candidates = await ctx.db.candidatePool.findMany({
          where: whereClause,
          orderBy: {
            createdAt: "desc"
          },
          take: limit + 1,
          ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
          }),
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (candidates.length > limit) {
          const nextItem = candidates.pop();
          nextCursor = nextItem?.id;
        }

        return {
          candidates,
          nextCursor,
        };
      } catch (error) {
        console.error('Error fetching candidates:', error);
        throw new Error("Failed to fetch candidates");
      }
    }),

  // Admin procedure to get candidate by ID
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const candidate = await ctx.db.candidatePool.findUnique({
          where: { id: input.id }
        });

        if (!candidate) {
          throw new Error("Candidate not found");
        }

        return candidate;
      } catch (error) {
        console.error('Error fetching candidate:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to fetch candidate");
      }
    }),

  // Admin procedure to update candidate status
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(CandidateStatus),
        notes: z.string().optional(),
        contactedBy: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const candidate = await ctx.db.candidatePool.update({
          where: { id: input.id },
          data: {
            status: input.status,
            notes: input.notes,
            contactedBy: input.contactedBy,
            contactedAt: input.status === "CONTACTED" ? new Date() : undefined,
            updatedAt: new Date(),
          }
        });

        return candidate;
      } catch (error) {
        console.error('Error updating candidate status:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to update candidate");
      }
    }),

  // Admin procedure to delete candidate
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.candidatePool.delete({
          where: { id: input.id }
        });

        return { success: true, message: "Candidate deleted successfully" };
      } catch (error) {
        console.error('Error deleting candidate:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to delete candidate");
      }
    }),

  // Admin procedure to get candidate statistics
  getStats: adminProcedure
    .query(async ({ ctx }) => {
      try {
        const total = await ctx.db.candidatePool.count();
        const active = await ctx.db.candidatePool.count({
          where: { status: "ACTIVE" }
        });
        const contacted = await ctx.db.candidatePool.count({
          where: { status: "CONTACTED" }
        });
        const placed = await ctx.db.candidatePool.count({
          where: { status: "PLACED" }
        });
        const needsVisa = await ctx.db.candidatePool.count({
          where: { needsVisaSponsorship: true }
        });

        // Get top professions
        const professionStats = await ctx.db.candidatePool.groupBy({
          by: ['profession'],
          _count: {
            profession: true
          },
          orderBy: {
            _count: {
              profession: 'desc'
            }
          },
          take: 10
        });

        // Get top destinations
        const destinationStats = await ctx.db.candidatePool.findMany({
          select: {
            preferredDestination: true
          }
        });

        const destinationCounts: Record<string, number> = {};
        destinationStats.forEach(candidate => {
          candidate.preferredDestination.forEach(dest => {
            destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
          });
        });

        const topDestinations = Object.entries(destinationCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([destination, count]) => ({ destination, count }));

        return {
          total,
          active,
          contacted,
          placed,
          needsVisa,
          professionStats,
          topDestinations
        };
      } catch (error) {
        console.error('Error fetching candidate stats:', error);
        throw new Error("Failed to fetch candidate statistics");
      }
    }),

  // Admin procedure to export candidates as CSV data
  exportCSV: adminProcedure
    .input(
      z.object({
        profession: z.string().optional(),
        destination: z.string().optional(),
        needsVisaSponsorship: z.boolean().optional(),
        status: z.nativeEnum(CandidateStatus).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const whereClause = {
          AND: [
            input.profession ? { profession: { contains: input.profession, mode: "insensitive" as const } } : {},
            input.destination ? { preferredDestination: { has: input.destination } } : {},
            input.needsVisaSponsorship !== undefined ? { needsVisaSponsorship: input.needsVisaSponsorship } : {},
            input.status ? { status: input.status } : {},
          ]
        };

        const candidates = await ctx.db.candidatePool.findMany({
          where: whereClause,
          orderBy: {
            createdAt: "desc"
          }
        });

        // Convert to CSV format
        const csvHeaders = [
          'Full Name',
          'Email',
          'Phone Number',
          'Country',
          'Profession',
          'Skills',
          'Years of Experience',
          'Education Level',
          'Preferred Destinations',
          'Needs Visa Sponsorship',
          'Job Alerts',
          'Status',
          'Notes',
          'Contacted At',
          'Contacted By',
          'Created At'
        ];

        const csvRows = candidates.map(candidate => [
          candidate.fullName,
          candidate.email,
          candidate.phoneNumber || '',
          candidate.country,
          candidate.profession,
          candidate.skills.join('; '),
          candidate.yearsOfExperience.toString(),
          candidate.educationLevel,
          candidate.preferredDestination.join('; '),
          candidate.needsVisaSponsorship ? 'Yes' : 'No',
          candidate.jobAlerts ? 'Yes' : 'No',
          candidate.status,
          candidate.notes || '',
          candidate.contactedAt?.toISOString() || '',
          candidate.contactedBy || '',
          candidate.createdAt.toISOString()
        ]);

        return {
          headers: csvHeaders,
          rows: csvRows,
          totalCount: candidates.length
        };
      } catch (error) {
        console.error('Error exporting candidates:', error);
        throw new Error("Failed to export candidates");
      }
    }),
});
