/*
  Warnings:

  - The `requirements` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "country" TEXT,
ADD COLUMN     "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "requirements",
ADD COLUMN     "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "skills" SET DEFAULT ARRAY[]::TEXT[];
