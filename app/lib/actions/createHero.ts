'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { ICreateHero } from '@/types/entities/hero'

export async function createHero(data: ICreateHero) {
  try {
    const hero = await prisma.hero.create({
      data: {
        name: data.name,
        minHeight: data.minHeight,
        actualHeight: data.actualHeight,
        backgroundType: data.backgroundType,
        backgroundColor: data.backgroundColor,
        gradientFrom: data.gradientFrom,
        gradientTo: data.gradientTo,
        backgroundImage: data.backgroundImage,
        backgroundVideo: data.backgroundVideo,
        backgroundSize: data.backgroundSize,
        backgroundPosition: data.backgroundPosition,
        overlayOpacity: data.overlayOpacity,
        title: data.title,
        subtitle: data.subtitle,
        titleColor: data.titleColor,
        subtitleColor: data.subtitleColor,
        titleLineHeight: data.titleLineHeight,
        subtitleLineHeight: data.subtitleLineHeight,
        titleAnimation: data.titleAnimation,
        subtitleAnimation: data.subtitleAnimation,
        ctaAnimation: data.ctaAnimation,
        layout: data.layout,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        ctaBackgroundColor: data.ctaBackgroundColor,
        ctaTextColor: data.ctaTextColor,
        showThermometer: data.showThermometer,
        thermometerGoal: data.thermometerGoal,
        thermometerCurrent: data.thermometerCurrent,
        thermometerColor: data.thermometerColor,
        thermometerPosition: data.thermometerPosition,
        showCountdown: data.showCountdown,
        countdownDate: data.countdownDate,
        countdownLabel: data.countdownLabel,
        countdownPosition: data.countdownPosition,
        countdownColor: data.countdownColor,
        showGrowthTree: data.showGrowthTree,
        growthTreeCurrent: data.growthTreeCurrent,
        growthTreeGoal: data.growthTreeGoal,
        growthTreeLabel: data.growthTreeLabel,
        growthTreePosition: data.growthTreePosition,
        growthTreeColor: data.growthTreeColor,
        showFloatingButton: data.showFloatingButton,
        floatingButtonText: data.floatingButtonText,
        floatingButtonPosition: data.floatingButtonPosition,
        floatingButtonBgColor: data.floatingButtonBgColor,
        floatingButtonTextColor: data.floatingButtonTextColor,
        floatingButtonBorderRadius: data.floatingButtonBorderRadius,
        floatingButtonAnimation: data.floatingButtonAnimation,
        floatingButtonAction: data.floatingButtonAction,
        floatingButtonLink: data.floatingButtonLink,
        floatingButtonIcon: data.floatingButtonIcon
      }
    })

    await createLog('info', 'Hero created successfully', {
      heroId: hero.id,
      name: hero.name
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create hero', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name: data.name,
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create hero. Please try again.'
    }
  }
}
