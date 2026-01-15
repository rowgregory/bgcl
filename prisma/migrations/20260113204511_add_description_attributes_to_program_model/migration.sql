/*
  Warnings:

  - You are about to drop the column `description` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the `Closing` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description1` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Program" DROP COLUMN "description",
ADD COLUMN     "description1" TEXT NOT NULL,
ADD COLUMN     "description2" TEXT,
ADD COLUMN     "description3" TEXT,
ADD COLUMN     "description4" TEXT,
ADD COLUMN     "description5" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- DropTable
DROP TABLE "Closing";

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "paragraph1" TEXT,
    "paragraph2" TEXT,
    "paragraph3" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "News_title_idx" ON "News"("title");
