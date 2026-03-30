/*
  Warnings:

  - A unique constraint covering the columns `[raffleTicketCode]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isRaffle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "raffleDrawDate" TIMESTAMP(3),
ADD COLUMN     "raffleTerms" TEXT,
ADD COLUMN     "raffleTicketsPerOrder" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "raffleTicketCode" TEXT,
ADD COLUMN     "raffleTicketNumber" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_raffleTicketCode_key" ON "OrderItem"("raffleTicketCode");

-- CreateIndex
CREATE INDEX "OrderItem_raffleTicketCode_idx" ON "OrderItem"("raffleTicketCode");
