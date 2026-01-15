/*
  Warnings:

  - You are about to drop the column `authorizeBackground` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `certifyInformation` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `parentSignature` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `resumeFileName` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `resumeFileSize` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUploadedAt` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `understandActiveStatus` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhoneAndEmail` on the `Reference` table. All the data in the column will be lost.
  - Added the required column `email` to the `Reference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Reference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "authorizeBackground",
DROP COLUMN "certifyInformation",
DROP COLUMN "parentSignature",
DROP COLUMN "resumeFileName",
DROP COLUMN "resumeFileSize",
DROP COLUMN "resumeUploadedAt",
DROP COLUMN "resumeUrl",
DROP COLUMN "understandActiveStatus";

-- AlterTable
ALTER TABLE "Reference" DROP COLUMN "contactPhoneAndEmail",
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "phone" VARCHAR(20) NOT NULL;
