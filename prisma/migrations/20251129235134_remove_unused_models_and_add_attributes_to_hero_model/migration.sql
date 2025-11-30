/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthorizedPickup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckIn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgramEnrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StaffAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Youth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_parentId_fkey";

-- DropForeignKey
ALTER TABLE "AuthorizedPickup" DROP CONSTRAINT "AuthorizedPickup_parentId_fkey";

-- DropForeignKey
ALTER TABLE "AuthorizedPickup" DROP CONSTRAINT "AuthorizedPickup_youthId_fkey";

-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_checkedInByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_youthId_fkey";

-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramEnrollment" DROP CONSTRAINT "ProgramEnrollment_programId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramEnrollment" DROP CONSTRAINT "ProgramEnrollment_youthId_fkey";

-- DropForeignKey
ALTER TABLE "StaffAssignment" DROP CONSTRAINT "StaffAssignment_programId_fkey";

-- DropForeignKey
ALTER TABLE "StaffAssignment" DROP CONSTRAINT "StaffAssignment_staffId_fkey";

-- DropForeignKey
ALTER TABLE "Youth" DROP CONSTRAINT "Youth_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Youth" DROP CONSTRAINT "Youth_userId_fkey";

-- AlterTable
ALTER TABLE "Hero" ADD COLUMN     "titleGradientFrom" TEXT NOT NULL DEFAULT '#6366f1',
ADD COLUMN     "titleGradientTo" TEXT NOT NULL DEFAULT '#ec4899',
ADD COLUMN     "titleGradientWord" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "titleUseGradient" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "floatingButtonBorderRadius" SET DEFAULT '50';

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "AuthorizedPickup";

-- DropTable
DROP TABLE "CheckIn";

-- DropTable
DROP TABLE "Parent";

-- DropTable
DROP TABLE "Program";

-- DropTable
DROP TABLE "ProgramEnrollment";

-- DropTable
DROP TABLE "StaffAssignment";

-- DropTable
DROP TABLE "Youth";

-- DropEnum
DROP TYPE "AddressType";

-- DropEnum
DROP TYPE "CheckInMethod";

-- DropEnum
DROP TYPE "EnrollmentStatus";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "MaritalStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "ProgramCategory";

-- DropEnum
DROP TYPE "ProgramStatus";

-- DropEnum
DROP TYPE "YouthStatus";
