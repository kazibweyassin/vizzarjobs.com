import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import { db } from "~/server/db";
import { env } from "~/env";

type UserRole = "JOB_SEEKER" | "EMPLOYER" | "ADMIN";

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
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role || "JOB_SEEKER",
          profileComplete: user.profileComplete || false,
        },
      };
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async createUser({ user }) {
      // Set default role for new users
      try {
        await db.user.update({
          where: { id: user.id },
          data: {
            role: "JOB_SEEKER",
            profileComplete: false,
          },
        });
      } catch (error) {
        console.error("Error setting default user role:", error);
      }
    },
  },
} satisfies NextAuthConfig;
