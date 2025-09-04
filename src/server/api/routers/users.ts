import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const onboardingSteps = [
  { title: "Complete personal information", description: "Fill in your basic personal details" },
  { title: "Upload required documents", description: "Upload identification and work eligibility documents" },
  { title: "Set up payroll information", description: "Provide bank details for salary payments" },
  { title: "Review company policies", description: "Read and acknowledge company policies" },
  { title: "Schedule orientation", description: "Book a time for your orientation session" }
];

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
        include: {
          jobSeekerProfile: true
        }
      });
      return user;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }),
  
  startEmployeeOnboarding: protectedProcedure
    .input(
      z.object({
        companyId: z.string(),
        position: z.string(),
        department: z.string().optional(),
        startDate: z.date(),
        employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]).default("FULL_TIME"),
        salary: z.number().optional(),
        manager: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First update the user role to EMPLOYEE
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { 
            role: "EMPLOYEE",
            profileComplete: true 
          },
        });
        
        // Create a new employee record
        const employee = await ctx.db.employee.create({
          data: {
            userId: ctx.session.user.id,
            companyId: input.companyId,
            position: input.position,
            department: input.department,
            startDate: input.startDate,
            employmentType: input.employmentType,
            salary: input.salary,
            manager: input.manager,
            emergencyContact: input.emergencyContact,
            emergencyPhone: input.emergencyPhone,
            onboardingStatus: "IN_PROGRESS",
            onboardingSteps: {
              create: onboardingSteps.map(step => ({
                title: step.title,
                description: step.description,
                completed: false
              }))
            }
          },
          include: {
            onboardingSteps: true
          }
        });
        
        return employee;
      } catch (error) {
        console.error("❌ Employee onboarding failed:", error);
        throw error;
      }
    }),
    
  getEmployeeData: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      try {
        const employee = await ctx.db.employee.findUnique({
          where: { userId: ctx.session.user.id },
          include: {
            company: true,
            onboardingSteps: true,
            documents: true
          }
        });
        return employee;
      } catch (error) {
        console.error("Error fetching employee data:", error);
        return null;
      }
    }),
  
  updateOnboardingStep: protectedProcedure
    .input(
      z.object({
        stepId: z.string(),
        completed: z.boolean()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const step = await ctx.db.onboardingStep.update({
          where: { id: input.stepId },
          data: {
            completed: input.completed,
            completedAt: input.completed ? new Date() : null
          }
        });
        
        // Check if all steps are completed
        const employee = await ctx.db.employee.findFirst({
          where: { userId: ctx.session.user.id },
          include: {
            onboardingSteps: true
          }
        });
        
        if (employee && employee.onboardingSteps.every(step => step.completed)) {
          await ctx.db.employee.update({
            where: { id: employee.id },
            data: {
              onboardingStatus: "COMPLETED"
            }
          });
        }
        
        return step;
      } catch (error) {
        console.error("❌ Updating onboarding step failed:", error);
        throw error;
      }
    }),
    
  uploadDocument: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        url: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const employee = await ctx.db.employee.findUnique({
          where: { userId: ctx.session.user.id }
        });
        
        if (!employee) {
          throw new Error("Employee record not found");
        }
        
        const document = await ctx.db.document.create({
          data: {
            name: input.name,
            type: input.type,
            url: input.url,
            employeeId: employee.id
          }
        });
        
        return document;
      } catch (error) {
        console.error("❌ Document upload failed:", error);
        throw error;
      }
    }),
    
  updateJobSeekerProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string(),
        title: z.string(),
        skillsAndExperience: z.string(),
        preferredJobTypes: z.array(z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])),
        desiredSalary: z.string(),
        location: z.string(),
        willingToRelocate: z.boolean(),
        visaSponsorshipRequired: z.boolean(),
        linkedInProfile: z.string().optional(),
        portfolioUrl: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Update user's name and role
        const updatedUser = await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            name: input.fullName,
            role: "JOB_SEEKER",
            profileComplete: true,
            jobSeekerProfile: {
              upsert: {
                create: {
                  title: input.title,
                  skills: input.skillsAndExperience,
                  preferredJobTypes: input.preferredJobTypes,
                  desiredSalary: input.desiredSalary,
                  location: input.location,
                  willingToRelocate: input.willingToRelocate,
                  visaSponsorshipRequired: input.visaSponsorshipRequired,
                  linkedInProfile: input.linkedInProfile,
                  portfolioUrl: input.portfolioUrl,
                  lastUpdated: new Date()
                },
                update: {
                  title: input.title,
                  skills: input.skillsAndExperience,
                  preferredJobTypes: input.preferredJobTypes,
                  desiredSalary: input.desiredSalary,
                  location: input.location,
                  willingToRelocate: input.willingToRelocate,
                  visaSponsorshipRequired: input.visaSponsorshipRequired,
                  linkedInProfile: input.linkedInProfile,
                  portfolioUrl: input.portfolioUrl,
                  lastUpdated: new Date()
                }
              }
            }
          },
          include: {
            jobSeekerProfile: true
          }
        });
        
        return updatedUser;
      } catch (error) {
        console.error("❌ Job seeker profile update failed:", error);
        throw error;
      }
    }),
});
