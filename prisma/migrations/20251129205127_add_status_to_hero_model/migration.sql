-- AlterTable
ALTER TABLE "Hero" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "Hero_status_idx" ON "Hero"("status");
