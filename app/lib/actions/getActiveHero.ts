import prisma from "@/prisma/client";
import { IHeroEntity } from "@/types/entities/hero";
import { cache } from "react";

// Create a cached function for SSR - React will dedupe this across the request
export const getActiveHero = cache(async (): Promise<IHeroEntity | null> => {
  try {
    const hero = await prisma.hero.findFirst({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        status: true,
        minHeight: true,
        actualHeight: true,
        backgroundType: true,
        backgroundColor: true,
        gradientFrom: true,
        gradientTo: true,
        backgroundImage: true,
        backgroundVideo: true,
        backgroundSize: true,
        backgroundPosition: true,
        overlayOpacity: true,
        title: true,
        titleColor: true,
        titleLineHeight: true,
        titleGradientWord: true,
        titleGradientFrom: true,
        titleGradientTo: true,
        titleUseGradient: true,
        titleFontSize: true,
        subtitle: true,
        subtitleColor: true,
        subtitleLineHeight: true,
        subtitleFontSize: true,
        titleAnimation: true,
        subtitleAnimation: true,
        ctaAnimation: true,
        layout: true,
        ctaText: true,
        ctaLink: true,
        ctaBackgroundColor: true,
        ctaTextColor: true,
        ctaBorderRadius: true,
        showThermometer: true,
        thermometerGoal: true,
        thermometerCurrent: true,
        thermometerColor: true,
        thermometerPosition: true,
        showCountdown: true,
        countdownDate: true,
        countdownLabel: true,
        countdownPosition: true,
        countdownColor: true,
        showGrowthTree: true,
        growthTreeCurrent: true,
        growthTreeGoal: true,
        growthTreeLabel: true,
        growthTreePosition: true,
        growthTreeColor: true,
        showFloatingButton: true,
        floatingButtonText: true,
        floatingButtonPosition: true,
        floatingButtonBgColor: true,
        floatingButtonTextColor: true,
        floatingButtonBorderRadius: true,
        floatingButtonAnimation: true,
        floatingButtonAction: true,
        floatingButtonLink: true,
        floatingButtonIcon: true,
        showTopBanner: true,
        topBannerText: true,
        topBannerHeight: true,
        topBannerBgColor: true,
        topBannerTextColor: true,
        topBannerFontSize: true,
        topBannerBold: true,
        topBannerLinkType: true,
        topBannerLink: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return hero;
  } catch (error) {
    // Log async without blocking the response
    prisma.log
      .create({
        data: {
          level: "error",
          message: "Failed to fetch active hero",
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
          }),
        },
      })
      .catch(() => {}); // Fire and forget

    return null;
  }
});
