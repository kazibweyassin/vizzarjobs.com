import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcryptjs";

const onboardingSteps = [
  { title: "Complete personal information", description: "Fill in your basic personal details" },
  { title: "Upload required documents", description: "Upload identification and work eligibility documents" },
  { title: "Set up payroll information", description: "Provide bank details for salary payments" },
  { title: "Review company policies", description: "Read and acknowledge company policies" },
  { title: "Schedule orientation", description: "Book a time for your orientation session" }
];

export const usersRouter = createTRPCRouter({
  createWithPassword: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user already exists
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email }
        });

        if (existingUser) {
          throw new Error("User with this email already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Create the user with appropriate verification status
        const isJobSeeker = input.role === "JOB_SEEKER";
        
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            role: input.role,
            profileComplete: false,
            // Auto-approve job seekers, require manual approval for employers
            verificationStatus: isJobSeeker ? "APPROVED" : "PENDING",
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        console.error("User creation error:", error);
        throw error;
      }
    }),

  updateRole: protectedProcedure
    .input(
      z.object({
        role: z.enum(["JOB_SEEKER", "EMPLOYER", "ADMIN"]),
        profileComplete: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            role: input.role,
            profileComplete: input.profileComplete,
          },
        });

        return updatedUser;
      } catch (error) {
        throw error;
      }
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          jobSeekerProfile: true,
          employee: {
            include: {
              company: true
            }
          }
        }
      });
      return user;
    } catch (error) {
      return null;
    }
  }),

  getCount: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.user.count();
    const verified = await ctx.db.user.count({
      where: { profileComplete: true }
    });
    return { count: total, verified };
  }),

  getAllUsers: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.enum(["USER", "JOB_SEEKER", "EMPLOYER", "EMPLOYEE", "ADMIN"]).optional(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED", "NEED_MORE_INFO"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Only administrators can view all users");
      }

      const { search, role, status, limit, cursor } = input;

      const whereClause = {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } }
            ]
          } : {},
          role ? { role } : {},
          status ? { verificationStatus: status } : {},
        ]
      };

      const users = await ctx.db.user.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verificationStatus: true,
          profileComplete: true,
          premium: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalCount = await ctx.db.user.count({
        where: whereClause,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (users.length > limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return {
        users,
        totalCount,
        nextCursor,
      };
    }),

  getVerifiedUsers: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("Only administrators can view user statistics");
    }

    const total = await ctx.db.user.count();
    const verified = await ctx.db.user.count({
      where: { verificationStatus: "APPROVED" }
    });
    const pending = await ctx.db.user.count({
      where: { verificationStatus: "PENDING" }
    });
    const rejected = await ctx.db.user.count({
      where: { verificationStatus: "REJECTED" }
    });

    return { 
      total, 
      verified, 
      pending, 
      rejected 
    };
  }),

  getPendingVerifications: protectedProcedure
    .input(z.object({ status: z.enum(["PENDING", "APPROVED", "REJECTED", "NEED_MORE_INFO"]) }))
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Only administrators can view pending verifications");
      }
      
      return await ctx.db.user.findMany({
        where: { 
          verificationStatus: input.status 
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          verificationStatus: true,
          verificationDate: true,
          verificationNotes: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  verifyUser: protectedProcedure
    .input(z.object({ 
      userId: z.string(),
      notes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Only administrators can verify users");
      }
      
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          verificationStatus: "APPROVED",
        },
      });
    }),

  rejectUser: protectedProcedure
    .input(z.object({ 
      userId: z.string(),
      notes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Only administrators can reject users");
      }
      
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          verificationStatus: "REJECTED",
        },
      });
    }),

  requestMoreInfo: protectedProcedure
    .input(z.object({ 
      userId: z.string(),
      notes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Only administrators can request more information");
      }
      
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          verificationStatus: "NEED_MORE_INFO",
        },
      });
    }),

  getUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Only administrators can view user details");
      }

      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          employee: {
            include: {
              company: true
            }
          },
          jobSeekerProfile: true,
          applications: {
            include: {
              job: {
                include: {
                  company: true
                }
              }
            },
            orderBy: {
              createdAt: "desc"
            },
            take: 10
          }
        }
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),

  getVerifiedUsers: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("Only administrators can view verified users");
    }
    
    return await ctx.db.user.count({
      where: { verificationStatus: "APPROVED" }
    });
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
