/*
  Warnings:

  - You are about to drop the column `resumeUrl` on the `JobSeekerProfile` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."ExperienceLevel" ADD VALUE 'LEAD';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."JobType" ADD VALUE 'PART_TIME';
ALTER TYPE "public"."JobType" ADD VALUE 'FREELANCE';

-- AlterTable
ALTER TABLE "public"."JobSeekerProfile" DROP COLUMN "resumeUrl",
ADD COLUMN     "availabilityDate" TIMESTAMP(3),
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "certifications" JSONB[],
ADD COLUMN     "currentJobTitle" TEXT,
ADD COLUMN     "education" JSONB[],
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "locationPreferences" TEXT[],
ADD COLUMN     "personalWebsite" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "projectsAndPublications" JSONB[],
ADD COLUMN     "remotePreference" TEXT,
ADD COLUMN     "salaryCurrency" TEXT DEFAULT 'USD',
ADD COLUMN     "technicalSkills" TEXT[],
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "workExperience" JSONB[],
ADD COLUMN     "yearsOfExperience" TEXT,
ALTER COLUMN "skills" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "password" TEXT,
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
