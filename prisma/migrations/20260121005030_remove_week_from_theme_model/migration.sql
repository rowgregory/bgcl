/*
  Warnings:

  - You are about to drop the column `week` on the `Theme` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[programId,order]` on the table `Theme` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Theme_programId_week_key";

-- AlterTable
ALTER TABLE "Theme" DROP COLUMN "week";

-- CreateIndex
CREATE UNIQUE INDEX "Theme_programId_order_key" ON "Theme"("programId", "order");
