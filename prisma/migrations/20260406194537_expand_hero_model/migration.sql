/*
  Warnings:

  - You are about to drop the column `ctaLink` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `ctaText` on the `Hero` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "ctaLink",
DROP COLUMN "ctaText",
ADD COLUMN     "announcementColor1" TEXT NOT NULL DEFAULT '#0ea5e9',
ADD COLUMN     "announcementColor2" TEXT NOT NULL DEFAULT '#6366f1',
ADD COLUMN     "cta1Link" TEXT NOT NULL DEFAULT '/',
ADD COLUMN     "cta1LinkType" TEXT NOT NULL DEFAULT 'internal',
ADD COLUMN     "cta1Text" TEXT NOT NULL DEFAULT 'Get Started',
ADD COLUMN     "cta2Link" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cta2LinkType" TEXT NOT NULL DEFAULT 'internal',
ADD COLUMN     "cta2Text" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "showCta2" BOOLEAN NOT NULL DEFAULT false;
