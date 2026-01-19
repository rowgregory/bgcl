/*
  Warnings:

  - Added the required column `type` to the `ContactSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactSubmissionType" AS ENUM ('VOLUNTEER', 'GENERAL');

-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "availabilityDays" TEXT,
ADD COLUMN     "availabilityHours" TEXT,
ADD COLUMN     "backgroundCheckAck" BOOLEAN,
ADD COLUMN     "programInterests" TEXT,
ADD COLUMN     "type" "ContactSubmissionType" NOT NULL,
ADD COLUMN     "yearsExperience" INTEGER,
ALTER COLUMN "subject" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
