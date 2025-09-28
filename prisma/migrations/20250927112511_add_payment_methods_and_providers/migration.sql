/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `Subscription` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'PAYPAL', 'WALLET');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('FLUTTERWAVE', 'PAYPAL', 'MTN_MOBILE_MONEY', 'AIRTEL_MONEY', 'PAYSTACK', 'MANUAL');

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "externalCustomerId" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'CARD',
ADD COLUMN     "paymentProvider" "public"."PaymentProvider" NOT NULL DEFAULT 'FLUTTERWAVE';
