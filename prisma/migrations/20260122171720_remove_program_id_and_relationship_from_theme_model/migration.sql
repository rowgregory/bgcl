/*
  Warnings:

  - You are about to drop the column `programId` on the `Theme` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Theme" DROP CONSTRAINT "Theme_programId_fkey";

-- DropIndex
DROP INDEX "Theme_programId_idx";

-- DropIndex
DROP INDEX "Theme_programId_order_key";

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "themes" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Theme" DROP COLUMN "programId";
