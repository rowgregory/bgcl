/*
  Warnings:

  - The `positionTypes` column on the `JobApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PositionType" AS ENUM ('SEASONAL_SUMMER', 'CAMP_COUNSELOR', 'LIFEGUARD');

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "positionTypes",
ADD COLUMN     "positionTypes" "PositionType"[];
