-- AlterTable
ALTER TABLE "Hero" ADD COLUMN     "growthTreeColor" TEXT NOT NULL DEFAULT '#10b981',
ADD COLUMN     "growthTreeCurrent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "growthTreeGoal" INTEGER NOT NULL DEFAULT 10000,
ADD COLUMN     "growthTreeLabel" TEXT NOT NULL DEFAULT 'Community Members',
ADD COLUMN     "showGrowthTree" BOOLEAN NOT NULL DEFAULT false;
