-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "dates" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Theme_programId_idx" ON "Theme"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_programId_week_key" ON "Theme"("programId", "week");

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
