import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const authRouter = createTRPCRouter({
  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user exists
        const user = await ctx.db.user.findUnique({
          where: { email: input.email }
        });

        if (!user) {
          // Don't reveal if user exists or not for security
          return { success: true };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save reset token to user
        await ctx.db.user.update({
          where: { id: user.id },
          data: {
            passwordResetToken: resetToken,
            passwordResetExpires: resetExpires,
          },
        });

        // TODO: Send email with reset link
        // For now, we'll just log the token (in production, send via email)
        console.log(`Password reset token for ${input.email}: ${resetToken}`);
        console.log(`Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`);

        return { success: true };
      } catch (error) {
        console.error("Password reset request error:", error);
        throw new Error("Failed to process password reset request");
      }
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, "Reset token is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find user by reset token
        const user = await ctx.db.user.findFirst({
          where: {
            passwordResetToken: input.token,
            passwordResetExpires: {
              gt: new Date(), // Token must not be expired
            },
          },
        });

        if (!user) {
          throw new Error("Invalid or expired reset token");
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Update user password and clear reset token
        await ctx.db.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
            failedLoginAttempts: 0, // Reset failed login attempts
            lockedUntil: null, // Unlock account if locked
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Password reset error:", error);
        throw error;
      }
    }),

  changePassword: publicProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(8, "New password must be at least 8 characters"),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get user
        const user = await ctx.db.user.findUnique({
          where: { id: input.userId }
        });

        if (!user || !user.password) {
          throw new Error("User not found or no password set");
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(
          input.currentPassword,
          user.password
        );

        if (!isCurrentPasswordValid) {
          throw new Error("Current password is incorrect");
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(input.newPassword, 12);

        // Update password
        await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            password: hashedPassword,
            failedLoginAttempts: 0, // Reset failed login attempts
            lockedUntil: null, // Unlock account if locked
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Password change error:", error);
        throw error;
      }
    }),
});
