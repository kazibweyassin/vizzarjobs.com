import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        // Append pgbouncer=true and connection_limit to prevent exhausting
        // the Postgres connection pool on serverless/edge environments.
        // Values are appended only when a DATABASE_URL is present.
        url: env.DATABASE_URL,
      },
    },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Reuse the client across hot-reloads in development.
// In production each serverless invocation gets a new module scope, so we
// rely on Prisma's built-in connection pool (default pool_size = 10).
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
