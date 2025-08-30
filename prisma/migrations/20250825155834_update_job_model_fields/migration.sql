/*
  Warnings:

  - You are about to drop the column `salary` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Job` table. All the data in the column will be lost.
  - The `experienceLevel` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "salary",
DROP COLUMN "type",
ADD COLUMN     "applicationUrl" TEXT,
ADD COLUMN     "jobType" "public"."JobType",
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
DROP COLUMN "experienceLevel",
ADD COLUMN     "experienceLevel" "public"."ExperienceLevel";
