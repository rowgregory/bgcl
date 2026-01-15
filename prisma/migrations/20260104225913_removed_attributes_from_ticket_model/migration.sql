/*
  Warnings:

  - You are about to drop the column `maxPerOrder` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `minPerOrder` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `requiresApproval` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `salesEndDate` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `salesStartDate` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Ticket_eventId_salesStartDate_idx";

-- DropIndex
DROP INDEX "Ticket_salesEndDate_idx";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "maxPerOrder",
DROP COLUMN "minPerOrder",
DROP COLUMN "requiresApproval",
DROP COLUMN "salesEndDate",
DROP COLUMN "salesStartDate";
