-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "profileComplete" BOOLEAN NOT NULL DEFAULT false;

-- RenameForeignKey
ALTER TABLE "public"."Job" RENAME CONSTRAINT "Job_companyId_fkey" TO "companyRelation";
