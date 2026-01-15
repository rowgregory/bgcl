/*
  Warnings:

  - The values [DONATION] on the enum `OrderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderType_new" AS ENUM ('ONE_TIME_DONATION', 'RECURRING_DONATION', 'TICKET_PURCHASE');
ALTER TABLE "Order" ALTER COLUMN "type" TYPE "OrderType_new" USING ("type"::text::"OrderType_new");
ALTER TYPE "OrderType" RENAME TO "OrderType_old";
ALTER TYPE "OrderType_new" RENAME TO "OrderType";
DROP TYPE "OrderType_old";
COMMIT;
