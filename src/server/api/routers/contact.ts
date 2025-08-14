import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        companyName: z.string().min(1, "Company name is required"),
        contactName: z.string().min(1, "Contact name is required"),
        contactEmail: z.string().email("Valid email is required"),
        contactPhone: z.string().optional(),
        website: z.string().url().optional().or(z.literal("")),
        industry: z.string().min(1, "Industry is required"),
        companySize: z.string().min(1, "Company size is required"),
        location: z.string().min(1, "Location is required"),
        description: z.string().min(10, "Description must be at least 10 characters"),
        visaSponsorshipConfirmed: z.boolean().refine(val => val === true, {
          message: "Visa sponsorship confirmation is required"
        }),
        requestType: z.enum(["ADD_COMPANY", "GENERAL_INQUIRY"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Store the contact request in the database
      const contactRequest = await ctx.db.contactRequest.create({
        data: {
          companyName: input.companyName,
          contactName: input.contactName,
          contactEmail: input.contactEmail,
          contactPhone: input.contactPhone,
          website: input.website || null,
          industry: input.industry,
          companySize: input.companySize,
          location: input.location,
          description: input.description,
          visaSponsorshipConfirmed: input.visaSponsorshipConfirmed,
          requestType: input.requestType,
          status: "PENDING",
        },
      });

      // In a real application, you would also:
      // 1. Send an email notification to admins
      // 2. Send a confirmation email to the company
      // 3. Add to a review queue

      return {
        success: true,
        id: contactRequest.id,
        message: "Your request has been submitted successfully"
      };
    }),

  getAll: publicProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.contactRequest.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: input.status ? { status: input.status } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
        adminNotes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedRequest = await ctx.db.contactRequest.update({
        where: { id: input.id },
        data: {
          status: input.status,
          adminNotes: input.adminNotes,
          reviewedAt: new Date(),
        },
      });

      // If approved, create the company automatically
      if (input.status === "APPROVED") {
        await ctx.db.company.create({
          data: {
            name: updatedRequest.companyName,
            description: updatedRequest.description,
            website: updatedRequest.website,
            size: updatedRequest.companySize,
            industry: updatedRequest.industry,
            location: updatedRequest.location,
          },
        });
      }

      return updatedRequest;
    }),
});
