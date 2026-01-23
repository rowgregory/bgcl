/*
  Warnings:

  - You are about to drop the `ModalContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "externalLink" TEXT DEFAULT '';

-- DropTable
DROP TABLE "ModalContent";
