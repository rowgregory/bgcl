-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "attendingEvent" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "guestCount" INTEGER NOT NULL DEFAULT 1;
