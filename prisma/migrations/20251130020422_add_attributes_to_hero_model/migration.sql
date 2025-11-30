-- AlterTable
ALTER TABLE "Hero" ADD COLUMN     "ctaBorderRadius" TEXT NOT NULL DEFAULT '50',
ADD COLUMN     "showTopBanner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "topBannerBgColor" TEXT NOT NULL DEFAULT '#6366f1',
ADD COLUMN     "topBannerBold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "topBannerFontSize" TEXT NOT NULL DEFAULT '0.875',
ADD COLUMN     "topBannerHeight" TEXT NOT NULL DEFAULT '40',
ADD COLUMN     "topBannerLink" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "topBannerLinkType" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "topBannerText" TEXT NOT NULL DEFAULT 'Click here to learn about our Capital Campaign',
ADD COLUMN     "topBannerTextColor" TEXT NOT NULL DEFAULT '#ffffff';
