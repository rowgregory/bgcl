import { HeroStatus } from '@prisma/client'

// ─── Interface ────────────────────────────────────────────────────────────────
export interface IHero {
  id: string
  name: string
  status: HeroStatus

  // Content
  title: string
  subtitle: string

  // Background
  backgroundType: 'video' | 'image'
  backgroundVideo: string
  backgroundImage: string
  overlayOpacity: number

  cta1Text: string
  cta1Link: string
  cta1LinkType: 'internal' | 'external'

  cta2Text: string
  cta2Link: string
  cta2LinkType: 'internal' | 'external'
  showCta2: boolean

  // Announcement Strip
  showAnnouncement: boolean
  announcementText: string
  announcementLinkLabel: string
  announcementLink: string
  announcementLinkType: 'internal' | 'external'
  announcementColor1: string
  announcementColor2: string

  // Countdown
  showCountdown: boolean
  countdownDate: string
  countdownLabel: string

  // Metadata
  createdAt: Date
  updatedAt: Date

  showThermometer: boolean
  thermometerGoal: number
  thermometerCurrent: number
  thermometerLabel: string
  thermometerColor: string

  showGrowthTree: boolean
  growthTreeCurrent: number
  growthTreeGoal: number
  growthTreeLabel: string
  growthTreeColor: string
}
