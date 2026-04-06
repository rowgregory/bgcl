/*
  Warnings:

  - You are about to drop the column `actualHeight` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundPosition` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundSize` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `countdownColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `countdownPosition` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `ctaAnimation` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `ctaBackgroundColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `ctaBorderRadius` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `ctaTextColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonAction` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonAnimation` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonBgColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonBorderRadius` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonIcon` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonLink` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonPosition` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonText` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `floatingButtonTextColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `gradientFrom` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `gradientTo` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `growthTreeColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `growthTreeCurrent` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `growthTreeGoal` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `growthTreeLabel` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `growthTreePosition` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `layout` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `minHeight` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `showFloatingButton` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `showGrowthTree` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `showThermometer` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `showTopBanner` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `subtitleAnimation` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `subtitleColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `subtitleFontSize` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `subtitleLineHeight` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `thermometerColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `thermometerCurrent` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `thermometerGoal` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `thermometerPosition` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `titleAnimation` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `titleColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `titleFontSize` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `titleGradientFrom` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `titleGradientTo` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `titleGradientWord` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `titleLineHeight` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `titleUseGradient` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `topBannerBgColor` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `topBannerBold` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `topBannerFontSize` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `topBannerHeight` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `topBannerLink` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `topBannerLinkType` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `topBannerText` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `topBannerTextColor` on the `Hero` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Hero_createdAt_idx";

-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "actualHeight",
DROP COLUMN "backgroundColor",
DROP COLUMN "backgroundPosition",
DROP COLUMN "backgroundSize",
DROP COLUMN "countdownColor",
DROP COLUMN "countdownPosition",
DROP COLUMN "ctaAnimation",
DROP COLUMN "ctaBackgroundColor",
DROP COLUMN "ctaBorderRadius",
DROP COLUMN "ctaTextColor",
DROP COLUMN "floatingButtonAction",
DROP COLUMN "floatingButtonAnimation",
DROP COLUMN "floatingButtonBgColor",
DROP COLUMN "floatingButtonBorderRadius",
DROP COLUMN "floatingButtonIcon",
DROP COLUMN "floatingButtonLink",
DROP COLUMN "floatingButtonPosition",
DROP COLUMN "floatingButtonText",
DROP COLUMN "floatingButtonTextColor",
DROP COLUMN "gradientFrom",
DROP COLUMN "gradientTo",
DROP COLUMN "growthTreeColor",
DROP COLUMN "growthTreeCurrent",
DROP COLUMN "growthTreeGoal",
DROP COLUMN "growthTreeLabel",
DROP COLUMN "growthTreePosition",
DROP COLUMN "layout",
DROP COLUMN "minHeight",
DROP COLUMN "showFloatingButton",
DROP COLUMN "showGrowthTree",
DROP COLUMN "showThermometer",
DROP COLUMN "showTopBanner",
DROP COLUMN "subtitleAnimation",
DROP COLUMN "subtitleColor",
DROP COLUMN "subtitleFontSize",
DROP COLUMN "subtitleLineHeight",
DROP COLUMN "thermometerColor",
DROP COLUMN "thermometerCurrent",
DROP COLUMN "thermometerGoal",
DROP COLUMN "thermometerPosition",
DROP COLUMN "titleAnimation",
DROP COLUMN "titleColor",
DROP COLUMN "titleFontSize",
DROP COLUMN "titleGradientFrom",
DROP COLUMN "titleGradientTo",
DROP COLUMN "titleGradientWord",
DROP COLUMN "titleLineHeight",
DROP COLUMN "titleUseGradient",
DROP COLUMN "topBannerBgColor",
DROP COLUMN "topBannerBold",
DROP COLUMN "topBannerFontSize",
DROP COLUMN "topBannerHeight",
DROP COLUMN "topBannerLink",
DROP COLUMN "topBannerLinkType",
DROP COLUMN "topBannerText",
DROP COLUMN "topBannerTextColor",
ADD COLUMN     "announcementLink" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "announcementLinkLabel" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "announcementLinkType" TEXT NOT NULL DEFAULT 'internal',
ADD COLUMN     "announcementText" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "showAnnouncement" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "backgroundType" SET DEFAULT 'video',
ALTER COLUMN "countdownDate" SET DEFAULT '';
