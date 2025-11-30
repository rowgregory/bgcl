import { createLog } from "@/app/lib/actions/createLog";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/hero - Get all heroes
export async function GET() {
  try {
    const heroes = await prisma.hero.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: heroes });
  } catch (error) {
    await createLog("error", "Failed to fetch heroes", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch heroes",
      },
      { status: 500 }
    );
  }
}

// POST /api/hero - Create new hero
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const hero = await prisma.hero.create({
      data: {
        name: body.name,
        minHeight: body.minHeight,
        actualHeight: body.actualHeight,
        backgroundType: body.backgroundType,
        backgroundColor: body.backgroundColor,
        gradientFrom: body.gradientFrom,
        gradientTo: body.gradientTo,
        backgroundImage: body.backgroundImage,
        backgroundVideo: body.backgroundVideo,
        backgroundSize: body.backgroundSize,
        backgroundPosition: body.backgroundPosition,
        overlayOpacity: body.overlayOpacity,
        title: body.title,
        subtitle: body.subtitle,
        titleColor: body.titleColor,
        subtitleColor: body.subtitleColor,
        titleLineHeight: body.titleLineHeight,
        subtitleLineHeight: body.subtitleLineHeight,
        titleAnimation: body.titleAnimation,
        subtitleAnimation: body.subtitleAnimation,
        ctaAnimation: body.ctaAnimation,
        layout: body.layout,
        ctaText: body.ctaText,
        ctaLink: body.ctaLink,
        ctaBackgroundColor: body.ctaBackgroundColor,
        ctaTextColor: body.ctaTextColor,
        showThermometer: body.showThermometer,
        thermometerGoal: body.thermometerGoal,
        thermometerCurrent: body.thermometerCurrent,
        thermometerColor: body.thermometerColor,
        thermometerPosition: body.thermometerPosition,
        showCountdown: body.showCountdown,
        countdownDate: body.countdownDate,
        countdownLabel: body.countdownLabel,
        countdownPosition: body.countdownPosition,
        countdownColor: body.countdownColor,
        showGrowthTree: body.showGrowthTree,
        growthTreeCurrent: body.growthTreeCurrent,
        growthTreeGoal: body.growthTreeGoal,
        growthTreeLabel: body.growthTreeLabel,
        growthTreePosition: body.growthTreePosition,
        growthTreeColor: body.growthTreeColor,
        showFloatingButton: body.showFloatingButton,
        floatingButtonText: body.floatingButtonText,
        floatingButtonPosition: body.floatingButtonPosition,
        floatingButtonBgColor: body.floatingButtonBgColor,
        floatingButtonTextColor: body.floatingButtonTextColor,
        floatingButtonBorderRadius: body.floatingButtonBorderRadius,
        floatingButtonAnimation: body.floatingButtonAnimation,
        floatingButtonAction: body.floatingButtonAction,
        floatingButtonLink: body.floatingButtonLink,
        floatingButtonIcon: body.floatingButtonIcon,
      },
    });

    await createLog("info", "Hero created successfully", {
      heroId: hero.id,
      heroName: hero.name,
    });

    return NextResponse.json({ success: true, data: hero }, { status: 201 });
  } catch (error) {
    await createLog("error", "Failed to create hero", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create hero",
      },
      { status: 500 }
    );
  }
}
