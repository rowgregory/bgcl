-- AlterTable
ALTER TABLE "Hero" ADD COLUMN     "showThermometer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "thermometerColor" TEXT NOT NULL DEFAULT '#0ea5e9',
ADD COLUMN     "thermometerCurrent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "thermometerGoal" INTEGER NOT NULL DEFAULT 100000,
ADD COLUMN     "thermometerLabel" TEXT NOT NULL DEFAULT 'Campaign Progress';
