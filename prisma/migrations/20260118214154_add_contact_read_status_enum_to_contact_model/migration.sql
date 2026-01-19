-- CreateEnum
CREATE TYPE "ContactReadStatus" AS ENUM ('NEW', 'READ', 'ARCHIVED');

-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "status" "ContactReadStatus" NOT NULL DEFAULT 'NEW';
