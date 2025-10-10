import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";
import { env } from "~/env";

type UserRole = "USER" | "JOB_SEEKER" | "EMPLOYER" | "EMPLOYEE" | "ADMIN";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      profileComplete: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    profileComplete: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID ?? "",
      clientSecret: env.AUTH_GOOGLE_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: env.AUTH_GITHUB_ID ?? "",
      clientSecret: env.AUTH_GITHUB_SECRET ?? "",
    }),
    ...(env.AUTH_DISCORD_ID && env.AUTH_DISCORD_SECRET 
      ? [DiscordProvider({
          clientId: env.AUTH_DISCORD_ID,
          clientSecret: env.AUTH_DISCORD_SECRET,
        })]
      : []
    ),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email as string }
          });

          if (!user || !user.password) {
            return null;
          }

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error("Account is temporarily locked due to too many failed login attempts");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            // Increment failed login attempts
            await db.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: user.failedLoginAttempts + 1,
                lockedUntil: user.failedLoginAttempts >= 4 
                  ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
                  : null
              }
            });
            return null;
          }

          // Reset failed login attempts on successful login
          await db.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null
            }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            profileComplete: user.profileComplete,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.profileComplete = user.profileComplete;
      }
      
      // Always fetch the latest role from database for admin users
      if (token.sub) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.sub },
            select: { role: true, profileComplete: true }
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.profileComplete = dbUser.profileComplete;
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role || "JOB_SEEKER",
          profileComplete: token.profileComplete || false,
        },
      };
    },
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider !== "credentials") {
        return true;
      }
      
      // For credentials provider, user is already validated in authorize function
      return !!user;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async createUser({ user }) {
      // Set default role and auto-approve job seekers
      try {
        const userRole = user.role || "JOB_SEEKER";
        const isJobSeeker = userRole === "JOB_SEEKER" || userRole === "USER";
        
        await db.user.update({
          where: { id: user.id },
          data: {
            role: userRole,
            profileComplete: false,
            // Auto-approve job seekers, require manual approval for employers
            verificationStatus: isJobSeeker ? "APPROVED" : "PENDING",
            verificationDate: isJobSeeker ? new Date() : null,
            verificationNotes: isJobSeeker ? "Auto-approved job seeker" : null,
          },
        });
      } catch (error) {
        console.error("Error setting default user role:", error);
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig;
