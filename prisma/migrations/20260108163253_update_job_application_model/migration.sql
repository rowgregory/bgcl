/*
  Warnings:

  - You are about to drop the column `address` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `cellNumber` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `previousEmployment` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the `JobHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JobHistory" DROP CONSTRAINT "JobHistory_jobApplicationId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "address",
DROP COLUMN "cellNumber",
DROP COLUMN "city",
DROP COLUMN "education",
DROP COLUMN "previousEmployment",
DROP COLUMN "skills",
DROP COLUMN "state",
DROP COLUMN "zipCode",
ADD COLUMN     "authorizeBackground" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "certifyInformation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resumeFileName" VARCHAR(255),
ADD COLUMN     "resumeFileSize" INTEGER,
ADD COLUMN     "resumeUploadedAt" TIMESTAMP(3),
ADD COLUMN     "resumeUrl" VARCHAR(500),
ADD COLUMN     "understandActiveStatus" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "JobHistory";
