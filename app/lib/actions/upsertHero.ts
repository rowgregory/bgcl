'use server'

import prisma from '@/prisma/client'
import { IHero } from '@/types/entities/hero'
import { HeroStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const upsertHero = async (data: Partial<IHero>): Promise<{ success: boolean; data?: IHero; error?: string }> => {
  try {
    const existing = await prisma.hero.findFirst()

    const hero = await prisma.hero.upsert({
      where: { id: existing?.id ?? 'singleton' },
      update: data,
      create: {
        name: 'Main Hero',
        status: HeroStatus.DRAFT,
        title: 'Welcome to Our Mission',
        subtitle: 'Join us in making a difference',
        backgroundType: 'video',
        backgroundVideo: '',
        backgroundImage: '',
        overlayOpacity: 0.5,
        cta1Text: 'Get Started',
        cta1Link: '/',
        cta1LinkType: 'internal',
        cta2Text: '',
        cta2Link: '',
        cta2LinkType: 'internal',
        showCta2: false,
        showAnnouncement: false,
        announcementText: '',
        announcementLinkLabel: '',
        announcementLink: '',
        announcementLinkType: 'internal',
        showCountdown: false,
        countdownDate: '',
        countdownLabel: 'Event Starts In',
        showThermometer: false,
        thermometerGoal: 100000,
        thermometerCurrent: 0,
        thermometerLabel: 'Campaign Progress',
        thermometerColor: '#0ea5e9',
        showGrowthTree: false,
        growthTreeCurrent: 0,
        growthTreeGoal: 10000,
        growthTreeLabel: 'Community Members',
        growthTreeColor: '#10b981',
        ...data
      }
    })

    revalidatePath('/', 'layout')

    return { success: true, data: hero as IHero }
  } catch (error) {
    return { success: false, error: 'Failed to save hero' }
  }
}
