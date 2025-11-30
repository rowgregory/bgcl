-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minHeight" TEXT NOT NULL DEFAULT 'screen',
    "actualHeight" TEXT NOT NULL DEFAULT '100vh',
    "backgroundType" TEXT NOT NULL DEFAULT 'gradient',
    "backgroundColor" TEXT NOT NULL DEFAULT '#0a0a0a',
    "gradientFrom" TEXT NOT NULL DEFAULT '#1e1b4b',
    "gradientTo" TEXT NOT NULL DEFAULT '#0f172a',
    "backgroundImage" TEXT NOT NULL DEFAULT '',
    "backgroundVideo" TEXT NOT NULL DEFAULT '',
    "backgroundSize" TEXT NOT NULL DEFAULT 'cover',
    "backgroundPosition" TEXT NOT NULL DEFAULT 'center',
    "overlayOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "title" TEXT NOT NULL DEFAULT 'Welcome to Our Mission',
    "subtitle" TEXT NOT NULL DEFAULT 'Join us in making a difference',
    "titleColor" TEXT NOT NULL DEFAULT '#ffffff',
    "subtitleColor" TEXT NOT NULL DEFAULT '#a3a3a3',
    "titleLineHeight" TEXT NOT NULL DEFAULT '1.2',
    "subtitleLineHeight" TEXT NOT NULL DEFAULT '1.5',
    "titleAnimation" TEXT NOT NULL DEFAULT 'fade-up',
    "subtitleAnimation" TEXT NOT NULL DEFAULT 'fade-up',
    "ctaAnimation" TEXT NOT NULL DEFAULT 'fade-up',
    "layout" TEXT NOT NULL DEFAULT 'side-by-side',
    "ctaText" TEXT NOT NULL DEFAULT 'Get Started',
    "ctaLink" TEXT NOT NULL DEFAULT '/',
    "ctaBackgroundColor" TEXT NOT NULL DEFAULT '#6366f1',
    "ctaTextColor" TEXT NOT NULL DEFAULT '#ffffff',
    "showThermometer" BOOLEAN NOT NULL DEFAULT false,
    "thermometerGoal" INTEGER NOT NULL DEFAULT 100000,
    "thermometerCurrent" INTEGER NOT NULL DEFAULT 45000,
    "thermometerColor" TEXT NOT NULL DEFAULT '#6366f1',
    "thermometerPosition" TEXT NOT NULL DEFAULT 'right',
    "showCountdown" BOOLEAN NOT NULL DEFAULT false,
    "countdownDate" TEXT NOT NULL DEFAULT '2025-12-31',
    "countdownLabel" TEXT NOT NULL DEFAULT 'Event Starts In',
    "countdownPosition" TEXT NOT NULL DEFAULT 'right',
    "countdownColor" TEXT NOT NULL DEFAULT '#6366f1',
    "showGrowthTree" BOOLEAN NOT NULL DEFAULT false,
    "growthTreeCurrent" INTEGER NOT NULL DEFAULT 8234,
    "growthTreeGoal" INTEGER NOT NULL DEFAULT 10000,
    "growthTreeLabel" TEXT NOT NULL DEFAULT 'Community Members',
    "growthTreePosition" TEXT NOT NULL DEFAULT 'right',
    "growthTreeColor" TEXT NOT NULL DEFAULT '#10b981',
    "showFloatingButton" BOOLEAN NOT NULL DEFAULT false,
    "floatingButtonText" TEXT NOT NULL DEFAULT 'Get Help',
    "floatingButtonPosition" TEXT NOT NULL DEFAULT 'bottom-right',
    "floatingButtonBgColor" TEXT NOT NULL DEFAULT '#6366f1',
    "floatingButtonTextColor" TEXT NOT NULL DEFAULT '#ffffff',
    "floatingButtonBorderRadius" TEXT NOT NULL DEFAULT '9999',
    "floatingButtonAnimation" TEXT NOT NULL DEFAULT 'pulse',
    "floatingButtonAction" TEXT NOT NULL DEFAULT 'modal',
    "floatingButtonLink" TEXT NOT NULL DEFAULT '/contact',
    "floatingButtonIcon" TEXT NOT NULL DEFAULT 'chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hero_createdAt_idx" ON "Hero"("createdAt");

-- CreateIndex
CREATE INDEX "Event_chapterId_idx" ON "Event"("chapterId");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_chapterId_date_idx" ON "Event"("chapterId", "date");

-- CreateIndex
CREATE INDEX "Event_chapterId_status_idx" ON "Event"("chapterId", "status");

-- CreateIndex
CREATE INDEX "Event_status_date_idx" ON "Event"("status", "date");

-- CreateIndex
CREATE INDEX "Event_chapterId_status_date_idx" ON "Event"("chapterId", "status", "date");

-- CreateIndex
CREATE INDEX "Event_featured_status_date_idx" ON "Event"("featured", "status", "date");

-- CreateIndex
CREATE INDEX "Event_isPublic_status_date_idx" ON "Event"("isPublic", "status", "date");

-- CreateIndex
CREATE INDEX "Event_category_date_idx" ON "Event"("category", "date");

-- CreateIndex
CREATE INDEX "Event_type_date_idx" ON "Event"("type", "date");

-- CreateIndex
CREATE INDEX "Event_requiresRSVP_registrationDeadline_idx" ON "Event"("requiresRSVP", "registrationDeadline");
