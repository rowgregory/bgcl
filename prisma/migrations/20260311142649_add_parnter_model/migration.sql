-- CreateEnum
CREATE TYPE "PartnerTier" AS ENUM ('GOLD', 'SILVER', 'BRONZE', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "PartnerCategory" AS ENUM ('CORPORATE', 'NONPROFIT', 'GOVERNMENT', 'INDIVIDUAL');

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "externalLink" TEXT NOT NULL,
    "amount" TEXT,
    "image" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "category" "PartnerCategory" NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "tier" "PartnerTier" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);
