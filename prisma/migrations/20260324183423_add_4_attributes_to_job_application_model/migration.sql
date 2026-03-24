-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "education" TEXT,
ADD COLUMN     "extracurricularsSkills" TEXT,
ADD COLUMN     "positionTypes" TEXT[],
ADD COLUMN     "youthOrgEmployment" TEXT;
