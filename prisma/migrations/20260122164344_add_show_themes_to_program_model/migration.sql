-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "showThemes" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ModalContent" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModalContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModalContent_slug_key" ON "ModalContent"("slug");
