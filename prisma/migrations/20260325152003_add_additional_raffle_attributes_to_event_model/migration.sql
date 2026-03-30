-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "address" TEXT,
ADD COLUMN     "missionStatement" TEXT,
ADD COLUMN     "raffleGrandPrizeLabel" TEXT,
ADD COLUMN     "raffleOddsLabel" TEXT,
ADD COLUMN     "rafflePrizes" JSONB,
ADD COLUMN     "raffleSchedule" JSONB,
ADD COLUMN     "raffleTicketPrice" TEXT,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "website" TEXT;
