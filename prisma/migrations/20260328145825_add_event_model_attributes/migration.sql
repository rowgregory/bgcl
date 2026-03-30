-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "bestDressedPrizes" TEXT,
ADD COLUMN     "dressCodeHeadline" TEXT,
ADD COLUMN     "dressCodeItems" JSONB,
ADD COLUMN     "dressCodeNote" TEXT,
ADD COLUMN     "ticketSalesEndDate" TIMESTAMP(3),
ADD COLUMN     "ticketSalesStartDate" TIMESTAMP(3);
