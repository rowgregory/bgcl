/*
  Warnings:

  - The `type` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('IN_PERSON', 'HYBRID', 'VIRTUAL');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "rsvpDeadline" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "type",
ADD COLUMN     "type" "EventType" NOT NULL DEFAULT 'IN_PERSON';

-- CreateIndex
CREATE INDEX "Event_type_date_idx" ON "Event"("type", "date");
