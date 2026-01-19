-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Resource" ALTER COLUMN "order" SET DEFAULT 0;
