/*
  Warnings:

  - The values [DRAFT] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `Hero` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "HeroStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED');
ALTER TABLE "Event" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "status" TYPE "EventStatus_new" USING ("status"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "EventStatus_old";
ALTER TABLE "Event" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "status",
ADD COLUMN     "status" "HeroStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "Hero_status_idx" ON "Hero"("status");
