-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "coverFees" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "feesCovered" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "showAgeGroup" BOOLEAN NOT NULL DEFAULT false;
