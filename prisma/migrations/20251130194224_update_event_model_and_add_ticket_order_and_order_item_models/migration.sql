/*
  Warnings:

  - You are about to drop the column `chapterId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Event` table. All the data in the column will be lost.
  - Made the column `attendees` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'CONFIRMED', 'CANCELLED', 'REFUNDED', 'FAILED');

-- DropIndex
DROP INDEX "Event_chapterId_date_idx";

-- DropIndex
DROP INDEX "Event_chapterId_idx";

-- DropIndex
DROP INDEX "Event_chapterId_status_date_idx";

-- DropIndex
DROP INDEX "Event_chapterId_status_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "chapterId",
DROP COLUMN "cost",
ADD COLUMN     "allowMultipleTickets" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salesEndDate" TIMESTAMP(3),
ADD COLUMN     "salesStartDate" TIMESTAMP(3),
ALTER COLUMN "attendees" SET NOT NULL,
ALTER COLUMN "attendees" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "quantitySold" INTEGER NOT NULL DEFAULT 0,
    "quantityReserved" INTEGER NOT NULL DEFAULT 0,
    "minPerOrder" INTEGER NOT NULL DEFAULT 1,
    "maxPerOrder" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "salesStartDate" TIMESTAMP(3),
    "salesEndDate" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "paymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "billingAddress" JSONB,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "ticketName" TEXT NOT NULL,
    "ticketDescription" TEXT,
    "orderId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ticket_eventId_idx" ON "Ticket"("eventId");

-- CreateIndex
CREATE INDEX "Ticket_eventId_isAvailable_idx" ON "Ticket"("eventId", "isAvailable");

-- CreateIndex
CREATE INDEX "Ticket_eventId_salesStartDate_idx" ON "Ticket"("eventId", "salesStartDate");

-- CreateIndex
CREATE INDEX "Ticket_salesEndDate_idx" ON "Ticket"("salesEndDate");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_eventId_idx" ON "Order"("eventId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_ticketId_idx" ON "OrderItem"("ticketId");

-- CreateIndex
CREATE INDEX "Event_salesStartDate_idx" ON "Event"("salesStartDate");

-- CreateIndex
CREATE INDEX "Event_salesEndDate_idx" ON "Event"("salesEndDate");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
