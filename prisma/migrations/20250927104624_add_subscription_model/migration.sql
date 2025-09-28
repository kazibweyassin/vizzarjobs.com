-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAUSED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "billingCycle" "public"."BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "public"."Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "public"."Subscription"("status");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
