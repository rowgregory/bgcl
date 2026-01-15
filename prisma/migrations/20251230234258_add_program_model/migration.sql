-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "dropOffStart" TEXT NOT NULL,
    "dropOffEnd" TEXT NOT NULL,
    "pickUpStart" TEXT NOT NULL,
    "pickUpEnd" TEXT NOT NULL,
    "datesAvailable" TEXT,
    "license" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);
