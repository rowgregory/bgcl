/*
  Warnings:

  - You are about to drop the column `applicationDate` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `JobApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "applicationDate",
DROP COLUMN "submittedAt";
