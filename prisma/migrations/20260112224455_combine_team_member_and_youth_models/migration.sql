/*
  Warnings:

  - You are about to drop the `YouthOfTheYear` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "paragraph1" TEXT,
ADD COLUMN     "paragraph2" TEXT,
ADD COLUMN     "paragraph3" TEXT,
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "order" SET DEFAULT 0;

-- DropTable
DROP TABLE "YouthOfTheYear";

-- CreateIndex
CREATE INDEX "TeamMember_year_idx" ON "TeamMember"("year");
