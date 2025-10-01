import { postRouter } from "~/server/api/routers/post";
import { jobsRouter } from "~/server/api/routers/jobs";
import { companiesRouter } from "~/server/api/routers/companies";
import { applicationsRouter } from "~/server/api/routers/applications";
import { usersRouter } from "~/server/api/routers/users";
import { authRouter } from "~/server/api/routers/auth";
import { contactRouter } from "~/server/api/routers/contact";
import { contactRequestsRouter } from "~/server/api/routers/contactRequests";
import { matchingRouter } from "~/server/api/routers/matching";
import { subscriptionsRouter } from "~/server/api/routers/subscriptions";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  jobs: jobsRouter,
  companies: companiesRouter,
  applications: applicationsRouter,
  users: usersRouter,
  auth: authRouter,
  contact: contactRouter,
  contactRequests: contactRequestsRouter,
  matching: matchingRouter,
  subscriptions: subscriptionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
