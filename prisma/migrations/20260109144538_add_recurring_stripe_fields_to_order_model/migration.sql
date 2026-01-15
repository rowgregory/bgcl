/*
  Warnings:

  - You are about to drop the column `harnessPaymentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `harnessTransactionId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "harnessPaymentId",
DROP COLUMN "harnessTransactionId",
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nextBillingDate" TIMESTAMP(3),
ADD COLUMN     "recurringFrequency" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSubscriptionId_key" ON "Order"("stripeSubscriptionId");
