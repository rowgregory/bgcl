/*
  Warnings:

  - Made the column `additionalDetails` on table `Program` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Program" ALTER COLUMN "additionalDetails" SET NOT NULL;
