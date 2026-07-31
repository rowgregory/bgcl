'use client'

import { useState } from 'react'
import { Type } from 'lucide-react'
import { HeroStatus } from '@prisma/client'
import { IHero } from '@/types/entities/hero'
import { upsertHero } from '@/lib/actions/hero/upsertHero'
import { useRouter } from 'next/navigation'
import { SectionCard } from './_components/SectionCard'
import { Field } from './_components/Field'
import { BottomBar } from './_components/BottomBar'
import { Countdown } from './_components/Countdown'
import { Thermometer } from './_components/Thermometer'
import { GrowthTree } from './_components/GrowthTree'
import { AnnouncementStrip } from './_components/AnnouncementStrip'
import { Background } from './_components/Background'
import { CTA1 } from './_components/CTA1'
import { CTA2 } from './_components/CTA2'

interface AdminHeroClientProps {
  hero: IHero | null
  eventIds: { id: string; title: string }[]
  campaignIds: { id: string; name: string }[]
}

export const AdminHeroClient = ({ hero, eventIds, campaignIds }: AdminHeroClientProps) => {
  const router = useRouter()
  const [form, setForm] = useState<Partial<IHero>>({
    title: hero?.title ?? 'Welcome to Our Mission',
    subtitle: hero?.subtitle ?? 'Join us in making a difference',
    backgroundType: hero?.backgroundType ?? 'video',
    backgroundVideo: hero?.backgroundVideo ?? '',
    backgroundImage: hero?.backgroundImage ?? '',
    overlayOpacity: hero?.overlayOpacity ?? 0.5,
    cta1Text: hero?.cta1Text ?? 'Get Started',
    cta1Link: hero?.cta1Link ?? '/',
    cta1LinkType: hero?.cta1LinkType ?? 'internal',
    cta2Text: hero?.cta2Text ?? '',
    cta2Link: hero?.cta2Link ?? '',
    cta2LinkType: hero?.cta2LinkType ?? 'internal',
    showCta2: hero?.showCta2 ?? false,
    showAnnouncement: hero?.showAnnouncement ?? false,
    announcementText: hero?.announcementText ?? '',
    announcementLinkLabel: hero?.announcementLinkLabel ?? '',
    announcementLink: hero?.announcementLink ?? '',
    announcementLinkType: hero?.announcementLinkType ?? 'internal',
    announcementColor1: hero?.announcementColor1 ?? '#0ea5e9',
    announcementColor2: hero?.announcementColor2 ?? '#6366f1',
    showCountdown: hero?.showCountdown ?? false,
    countdownDate: hero?.countdownDate ?? '',
    countdownLabel: hero?.countdownLabel ?? 'Event Starts In',
    status: HeroStatus.ACTIVE,
    showThermometer: hero?.showThermometer ?? false,
    thermometerGoal: hero?.thermometerGoal ?? 100000,
    thermometerCurrent: hero?.thermometerCurrent ?? 0,
    thermometerLabel: hero?.thermometerLabel ?? 'Campaign Progress',
    thermometerColor: hero?.thermometerColor ?? '#0ea5e9',
    showGrowthTree: hero?.showGrowthTree ?? false,
    growthTreeCurrent: hero?.growthTreeCurrent ?? 0,
    growthTreeGoal: hero?.growthTreeGoal ?? 10000,
    growthTreeLabel: hero?.growthTreeLabel ?? 'Community Members',
    growthTreeColor: hero?.growthTreeColor ?? '#10b981'
  })

  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle')
  const set = (key: keyof IHero, value: any) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setSaveState('idle')
    try {
      const res = await upsertHero(form)
      router.refresh()
      setSaveState(res.success ? 'success' : 'error')
    } catch {
      setSaveState('error')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-neutral-50 pb-32">
      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <BottomBar handleSave={handleSave} saveState={saveState} saving={saving} />

      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── LEFT COLUMN — content + announcement ─────────────────── */}
          <div className="space-y-6">
            {/* Content */}
            <SectionCard icon={Type} title="Content">
              <Field
                id="hero-title"
                label="Title"
                value={form.title ?? ''}
                onChange={(v) => set('title', v)}
                placeholder="Welcome to Our Mission"
              />
              <Field
                id="hero-subtitle"
                label="Subtitle"
                value={form.subtitle ?? ''}
                onChange={(v) => set('subtitle', v)}
                placeholder="Join us in making a difference"
                rows={3}
              />

              {/* CTA 1 */}
              <CTA1 form={form} set={set} />

              {/* CTA 2 */}
              <CTA2 form={form} set={set} />
            </SectionCard>

            {/* Announcement Strip */}
            <AnnouncementStrip campaignIds={campaignIds} eventIds={eventIds} form={form} set={set} />
          </div>

          {/* ── RIGHT COLUMN — background + countdown ────────────────── */}
          <div className="space-y-6">
            {/* Background */}
            <Background form={form} set={set} />

            {/* Countdown */}
            <Countdown form={form} set={set} />

            {/* Thermometer */}
            <Thermometer form={form} set={set} />

            {/* Growth Tree */}
            <GrowthTree form={form} set={set} />
          </div>
        </div>
      </div>
    </div>
  )
}
