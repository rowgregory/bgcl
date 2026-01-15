/*
  Warnings:

  - You are about to drop the column `orderNumber` on the `Order` table. All the data in the column will be lost.
  - Added the required column `type` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DONATION', 'TICKET_PURCHASE');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_eventId_fkey";

-- DropIndex
DROP INDEX "Order_orderNumber_idx";

-- DropIndex
DROP INDEX "Order_orderNumber_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderNumber",
ADD COLUMN     "type" "OrderType" NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Order_type_idx" ON "Order"("type");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
