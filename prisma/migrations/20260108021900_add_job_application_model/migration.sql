-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'SEASONAL');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('INCOMPLETE', 'COMPLETE', 'SUBMITTED');

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "applicantName" VARCHAR(255) NOT NULL,
    "cellNumber" VARCHAR(20) NOT NULL,
    "address" VARCHAR(500) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "zipCode" VARCHAR(10) NOT NULL,
    "positionAppliedFor" VARCHAR(255) NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "hoursAvailable" TEXT NOT NULL,
    "languages" VARCHAR(500) NOT NULL,
    "previousEmployment" TEXT,
    "education" TEXT NOT NULL,
    "skills" TEXT,
    "hasValidDriverLicense" BOOLEAN NOT NULL,
    "licenseNumber" VARCHAR(50),
    "licenseExpiration" TIMESTAMP(3),
    "noLicenseReason" TEXT,
    "licenseSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspensionExplanation" TEXT,
    "trafficViolations" TEXT,
    "resumeUrl" VARCHAR(500),
    "resumeFileName" VARCHAR(255),
    "resumeFileSize" INTEGER,
    "resumeUploadedAt" TIMESTAMP(3),
    "agreeToTerms" BOOLEAN NOT NULL DEFAULT false,
    "certifyInformation" BOOLEAN NOT NULL DEFAULT false,
    "authorizeBackground" BOOLEAN NOT NULL DEFAULT false,
    "understandActiveStatus" BOOLEAN NOT NULL DEFAULT false,
    "signature" VARCHAR(255),
    "parentSignature" VARCHAR(255),
    "signedAt" TIMESTAMP(3),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "submissionStatus" "SubmissionStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobHistory" (
    "id" TEXT NOT NULL,
    "jobApplicationId" TEXT NOT NULL,
    "employerName" VARCHAR(255) NOT NULL,
    "employerAddress" VARCHAR(500) NOT NULL,
    "typeOfBusiness" VARCHAR(255) NOT NULL,
    "jobTitle" VARCHAR(255) NOT NULL,
    "jobDuties" TEXT NOT NULL,
    "supervisorName" VARCHAR(255) NOT NULL,
    "canContact" BOOLEAN NOT NULL DEFAULT true,
    "reasonForLeaving" TEXT NOT NULL,
    "employerTerminationReason" TEXT NOT NULL,
    "wasDisciplined" BOOLEAN NOT NULL DEFAULT false,
    "disciplineReason" TEXT,
    "wasTerminated" BOOLEAN NOT NULL DEFAULT false,
    "terminationExplanation" TEXT,
    "noticeGiven" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "jobApplicationId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "positionAndCompany" VARCHAR(500) NOT NULL,
    "workRelationship" VARCHAR(255) NOT NULL,
    "contactPhoneAndEmail" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_email_key" ON "JobApplication"("email");

-- AddForeignKey
ALTER TABLE "JobHistory" ADD CONSTRAINT "JobHistory_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
