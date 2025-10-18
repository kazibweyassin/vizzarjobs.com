-- CreateEnum
CREATE TYPE "public"."CandidateStatus" AS ENUM ('ACTIVE', 'CONTACTED', 'PLACED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE', 'CERTIFICATION', 'OTHER');

-- CreateTable
CREATE TABLE "public"."candidate_pool" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "country" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "yearsOfExperience" INTEGER NOT NULL,
    "educationLevel" "public"."EducationLevel" NOT NULL,
    "preferredDestination" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "needsVisaSponsorship" BOOLEAN NOT NULL DEFAULT false,
    "cvFilePath" TEXT,
    "jobAlerts" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."CandidateStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "contactedAt" TIMESTAMP(3),
    "contactedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_pool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidate_pool_email_key" ON "public"."candidate_pool"("email");
