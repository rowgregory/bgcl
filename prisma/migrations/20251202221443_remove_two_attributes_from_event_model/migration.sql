/*
  Warnings:

  - You are about to drop the column `clickCount` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "clickCount",
DROP COLUMN "viewCount";
