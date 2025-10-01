import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a Redis instance (you'll need to set up Upstash Redis or use a local Redis instance)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "http://localhost:6379",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Rate limiters for different endpoints
export const authRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
  analytics: true,
  prefix: "auth",
});

export const signUpRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 signups per hour
  analytics: true,
  prefix: "signup",
});

export const passwordResetRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 password reset attempts per hour
  analytics: true,
  prefix: "password-reset",
});

export const generalApiRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
  prefix: "api",
});

// Helper function to check rate limit
export async function checkRateLimit(
  rateLimit: Ratelimit,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
  const { success, limit, remaining, reset } = await rateLimit.limit(identifier);
  return { success, limit, remaining, reset };
}

// Helper function for IP-based rate limiting
export async function checkRateLimitByIP(
  rateLimit: Ratelimit,
  ip: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
  return checkRateLimit(rateLimit, ip);
}

// Helper function for user-based rate limiting
export async function checkRateLimitByUser(
  rateLimit: Ratelimit,
  userId: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
  return checkRateLimit(rateLimit, `user:${userId}`);
}
