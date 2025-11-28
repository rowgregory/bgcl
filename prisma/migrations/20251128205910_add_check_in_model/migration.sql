/*
  Warnings:

  - A unique constraint covering the columns `[pin]` on the table `Youth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qrCode]` on the table `Youth` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Parent` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CheckInMethod" AS ENUM ('PIN', 'QR_CODE', 'PHOTO', 'CARD', 'MANUAL', 'PARENT_APP');

-- AlterEnum
ALTER TYPE "StaffStatus" ADD VALUE 'INACTIVE';

-- AlterEnum
ALTER TYPE "YouthStatus" ADD VALUE 'EXPELLED';

-- DropIndex
DROP INDEX "Youth_status_idx";

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "email" TEXT,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Youth" ADD COLUMN     "canCheckInSelf" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "pin" TEXT,
ADD COLUMN     "qrCode" TEXT;

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "youthId" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkOutTime" TIMESTAMP(3),
    "method" "CheckInMethod" NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "isCheckedOut" BOOLEAN NOT NULL DEFAULT false,
    "checkedInByStaffId" TEXT,
    "checkedOutByStaffId" TEXT,
    "parentNotifiedCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "parentNotifiedCheckOut" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorizedPickup" (
    "id" TEXT NOT NULL,
    "youthId" TEXT NOT NULL,
    "parentId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "photoUrl" TEXT,
    "pin" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "specialInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorizedPickup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckIn_youthId_isCheckedOut_idx" ON "CheckIn"("youthId", "isCheckedOut");

-- CreateIndex
CREATE INDEX "CheckIn_isCheckedOut_checkInTime_idx" ON "CheckIn"("isCheckedOut", "checkInTime");

-- CreateIndex
CREATE INDEX "CheckIn_checkInTime_idx" ON "CheckIn"("checkInTime");

-- CreateIndex
CREATE INDEX "CheckIn_youthId_checkInTime_idx" ON "CheckIn"("youthId", "checkInTime");

-- CreateIndex
CREATE INDEX "AuthorizedPickup_youthId_isActive_idx" ON "AuthorizedPickup"("youthId", "isActive");

-- CreateIndex
CREATE INDEX "AuthorizedPickup_phone_idx" ON "AuthorizedPickup"("phone");

-- CreateIndex
CREATE INDEX "AuthorizedPickup_pin_idx" ON "AuthorizedPickup"("pin");

-- CreateIndex
CREATE INDEX "Parent_phone_idx" ON "Parent"("phone");

-- CreateIndex
CREATE INDEX "Parent_lastName_firstName_idx" ON "Parent"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Staff_status_idx" ON "Staff"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Youth_pin_key" ON "Youth"("pin");

-- CreateIndex
CREATE UNIQUE INDEX "Youth_qrCode_key" ON "Youth"("qrCode");

-- CreateIndex
CREATE INDEX "Youth_pin_idx" ON "Youth"("pin");

-- CreateIndex
CREATE INDEX "Youth_qrCode_idx" ON "Youth"("qrCode");

-- CreateIndex
CREATE INDEX "Youth_isActive_status_idx" ON "Youth"("isActive", "status");

-- CreateIndex
CREATE INDEX "Youth_parentId_idx" ON "Youth"("parentId");

-- CreateIndex
CREATE INDEX "Youth_isActive_lastName_firstName_idx" ON "Youth"("isActive", "lastName", "firstName");

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_youthId_fkey" FOREIGN KEY ("youthId") REFERENCES "Youth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_checkedInByStaffId_fkey" FOREIGN KEY ("checkedInByStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizedPickup" ADD CONSTRAINT "AuthorizedPickup_youthId_fkey" FOREIGN KEY ("youthId") REFERENCES "Youth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizedPickup" ADD CONSTRAINT "AuthorizedPickup_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
