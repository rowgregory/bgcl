/*
  Warnings:

  - You are about to drop the column `position` on the `TeamMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "position",
ADD COLUMN     "company" TEXT;
