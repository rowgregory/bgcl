/*
  Warnings:

  - The values [GOLD,SILVER,BRONZE,COMMUNITY] on the enum `PartnerTier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PartnerTier_new" AS ENUM ('FOUNDATION', 'CORPORATE_BUSINESS', 'GOVERNMENT_PUBLIC', 'COMMUNITY_PROGRAM');
ALTER TABLE "Partner" ALTER COLUMN "tier" TYPE "PartnerTier_new" USING ("tier"::text::"PartnerTier_new");
ALTER TYPE "PartnerTier" RENAME TO "PartnerTier_old";
ALTER TYPE "PartnerTier_new" RENAME TO "PartnerTier";
DROP TYPE "PartnerTier_old";
COMMIT;
