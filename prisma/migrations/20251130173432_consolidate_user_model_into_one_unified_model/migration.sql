/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hasLoginAccess` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_userId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "hasLoginAccess",
ADD COLUMN     "department" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "hireDate" TIMESTAMP(3),
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "staffStatus" "StaffStatus";

-- DropTable
DROP TABLE "Staff";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
