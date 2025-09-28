import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { PaymentMethod, PaymentProvider } from "@prisma/client";
import { PaymentService, getPaymentMethodsForRegion } from "~/lib/payments";

export const subscriptionsRouter = createTRPCRouter({
  // Get subscription plans
  getPlans: publicProcedure.query(async ({ ctx }) => {
    return [
      {
        id: "basic",
        name: "Basic",
        price: 0,
        currency: "USD",
        billingCycle: "MONTHLY" as const,
        features: [
          "Apply to regular jobs",
          "Basic profile visibility",
          "Job search filters",
          "Email notifications"
        ],
        popular: false
      },
      {
        id: "premium",
        name: "Premium",
        price: 19.99,
        currency: "USD",
        billingCycle: "MONTHLY" as const,
        features: [
          "Apply to premium jobs",
          "View full job details",
          "Priority application review",
          "Advanced job filters",
          "Direct employer contact",
          "Resume optimization tips",
          "Interview preparation guides"
        ],
        popular: true
      },
      {
        id: "premium_yearly",
        name: "Premium (Yearly)",
        price: 199.99,
        currency: "USD",
        billingCycle: "YEARLY" as const,
        features: [
          "Apply to premium jobs",
          "View full job details",
          "Priority application review",
          "Advanced job filters",
          "Direct employer contact",
          "Resume optimization tips",
          "Interview preparation guides",
          "2 months free (save $40)"
        ],
        popular: false
      }
    ];
  }),

  // Get user's current subscription
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    try {
      const subscription = await ctx.db.subscription.findFirst({
        where: {
          userId: ctx.session.user.id,
          status: "ACTIVE"
        },
        orderBy: { createdAt: "desc" }
      });

      return subscription;
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      return null;
    }
  }),

  // Check if user has premium access
  hasPremiumAccess: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          subscriptions: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 1
          }
        }
      });

      if (!user) return false;

      // Check if user has premium flag or active premium subscription
      if (user.premium) return true;
      
      const activeSubscription = user.subscriptions[0];
      if (activeSubscription && activeSubscription.planId !== "basic") {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking premium access:", error);
      return false;
    }
  }),

  // Create a subscription (for testing/demo purposes)
  createSubscription: protectedProcedure
    .input(z.object({
      planId: z.string(),
      planName: z.string(),
      price: z.number(),
      billingCycle: z.enum(["MONTHLY", "YEARLY"])
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if user already has an active subscription
        const existingSubscription = await ctx.db.subscription.findFirst({
          where: {
            userId: ctx.session.user.id,
            status: "ACTIVE"
          }
        });

        if (existingSubscription) {
          throw new Error("User already has an active subscription");
        }

        // Create new subscription
        const subscription = await ctx.db.subscription.create({
          data: {
            userId: ctx.session.user.id,
            planId: input.planId,
            planName: input.planName,
            price: input.price,
            billingCycle: input.billingCycle,
            status: "ACTIVE",
            startDate: new Date(),
            endDate: input.billingCycle === "MONTHLY" 
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
          }
        });

        // Update user premium status
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            premium: input.planId !== "basic",
            premiumTier: input.planId
          }
        });

        return subscription;
      } catch (error) {
        console.error("Error creating subscription:", error);
        throw error;
      }
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const subscription = await ctx.db.subscription.findUnique({
          where: { id: input.subscriptionId }
        });

        if (!subscription || subscription.userId !== ctx.session.user.id) {
          throw new Error("Subscription not found or unauthorized");
        }

        // Update subscription status
        const updatedSubscription = await ctx.db.subscription.update({
          where: { id: input.subscriptionId },
          data: {
            status: "CANCELLED",
            endDate: new Date()
          }
        });

        // Update user premium status
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            premium: false,
            premiumTier: null
          }
        });

        return updatedSubscription;
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        throw error;
      }
    }),

  // Get subscription history
  getSubscriptionHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const subscriptions = await ctx.db.subscription.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: "desc" }
      });

      return subscriptions;
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      return [];
    }
  }),

  // Get available payment methods for user's region
  getPaymentMethods: publicProcedure
    .input(z.object({ region: z.string().optional() }))
    .query(async ({ input }) => {
      const region = input.region || 'DEFAULT';
      return getPaymentMethodsForRegion(region);
    }),

  // Initiate payment for subscription
  initiatePayment: protectedProcedure
    .input(z.object({
      planId: z.string(),
      planName: z.string(),
      price: z.number(),
      billingCycle: z.enum(["MONTHLY", "YEARLY"]),
      paymentProvider: z.nativeEnum(PaymentProvider),
      paymentMethod: z.nativeEnum(PaymentMethod),
      currency: z.string().default("USD"),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if user already has an active subscription
        const existingSubscription = await ctx.db.subscription.findFirst({
          where: {
            userId: ctx.session.user.id,
            status: "ACTIVE"
          }
        });

        if (existingSubscription) {
          throw new Error("User already has an active subscription");
        }

        // Get user details
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id }
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Initiate payment
        const paymentResult = await PaymentService.initiatePayment({
          provider: input.paymentProvider,
          method: input.paymentMethod,
          amount: input.price,
          currency: input.currency,
          customerEmail: user.email || '',
          customerName: user.name || 'User',
          description: `VizzarJobs ${input.planName} Subscription`,
          callbackUrl: `${process.env.NEXTAUTH_URL}/subscription/callback`,
          metadata: {
            userId: user.id,
            planId: input.planId,
            billingCycle: input.billingCycle,
          },
        });

        if (!paymentResult.success) {
          throw new Error(paymentResult.error || 'Payment initiation failed');
        }

        // Create pending subscription
        const subscription = await ctx.db.subscription.create({
          data: {
            userId: ctx.session.user.id,
            planId: input.planId,
            planName: input.planName,
            price: input.price,
            currency: input.currency,
            billingCycle: input.billingCycle,
            status: "PENDING",
            paymentMethod: input.paymentMethod,
            paymentProvider: input.paymentProvider,
            externalId: paymentResult.transactionId,
            startDate: new Date(),
          }
        });

        return {
          subscriptionId: subscription.id,
          paymentUrl: paymentResult.paymentUrl,
          transactionId: paymentResult.transactionId,
          provider: input.paymentProvider,
          method: input.paymentMethod,
        };
      } catch (error) {
        console.error("Error initiating payment:", error);
        throw error;
      }
    }),

  // Verify payment and activate subscription
  verifyPayment: protectedProcedure
    .input(z.object({
      subscriptionId: z.string(),
      transactionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const subscription = await ctx.db.subscription.findUnique({
          where: { id: input.subscriptionId }
        });

        if (!subscription || subscription.userId !== ctx.session.user.id) {
          throw new Error("Subscription not found or unauthorized");
        }

        if (subscription.status !== "PENDING") {
          throw new Error("Subscription is not pending payment");
        }

        // Verify payment with provider
        const verification = await PaymentService.verifyPayment(
          subscription.paymentProvider,
          input.transactionId
        );

        if (!verification.success) {
          // Update subscription status to failed
          await ctx.db.subscription.update({
            where: { id: input.subscriptionId },
            data: { status: "CANCELLED" }
          });
          throw new Error("Payment verification failed");
        }

        // Calculate end date
        const endDate = subscription.billingCycle === "MONTHLY" 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

        // Activate subscription
        const updatedSubscription = await ctx.db.subscription.update({
          where: { id: input.subscriptionId },
          data: {
            status: "ACTIVE",
            endDate: endDate,
            externalId: verification.transactionId,
          }
        });

        // Update user premium status
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            premium: true,
            premiumTier: subscription.planId
          }
        });

        return updatedSubscription;
      } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
      }
    }),
});
