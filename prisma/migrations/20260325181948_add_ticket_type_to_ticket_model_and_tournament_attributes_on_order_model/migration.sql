-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('GENERAL', 'RAFFLE', 'TOURNAMENT', 'SPONSORSHIP');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "participatingInTournament" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tournamentFeePaid" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "sponsorImpact" TEXT,
ADD COLUMN     "sponsorPerks" TEXT[],
ADD COLUMN     "ticketType" "TicketType" NOT NULL DEFAULT 'GENERAL';
