-- CreateTable
CREATE TABLE "public"."JobSeekerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "preferredJobTypes" TEXT[],
    "desiredSalary" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "willingToRelocate" BOOLEAN NOT NULL DEFAULT false,
    "visaSponsorshipRequired" BOOLEAN NOT NULL DEFAULT false,
    "linkedInProfile" TEXT,
    "portfolioUrl" TEXT,
    "resumeUrl" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSeekerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobSeekerProfile_userId_key" ON "public"."JobSeekerProfile"("userId");

-- CreateIndex
CREATE INDEX "JobSeekerProfile_userId_idx" ON "public"."JobSeekerProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."JobSeekerProfile" ADD CONSTRAINT "JobSeekerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
