'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Film,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Megaphone,
  Timer,
  Save,
  Loader2,
  ExternalLink,
  Link2,
  ToggleLeft,
  ToggleRight,
  Play,
  Type,
  Target,
  Leaf
} from 'lucide-react'
import { HeroStatus } from '@prisma/client'
import { IHero } from '@/types/entities/hero'
import uploadFileToFirebase from '@/app/lib/firebase/uploadFileToFirebase'
import { upsertHero } from '@/app/lib/actions/upsertHero'
import { useRouter } from 'next/navigation'

/* ─── Types ──────────────────────────────────────────────────────────── */
interface AdminHeroClientProps {
  hero: IHero | null
  eventIds: { id: string; title: string }[]
  campaignIds: { id: string; name: string }[]
}

/* ─── Upload Zone ────────────────────────────────────────────────────── */
interface UploadZoneProps {
  type: 'image' | 'video'
  currentUrl: string
  onUploadComplete: (url: string) => void
  label: string
}

const UploadZone = ({ type, currentUrl, onUploadComplete, label }: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const accept =
    type === 'video'
      ? 'video/mp4,video/webm,video/quicktime,.mov,.mp4,.webm'
      : 'image/jpeg,image/png,image/webp,image/gif'
  const maxMb = type === 'video' ? 200 : 10

  const handleFile = useCallback(
    async (file: File) => {
      const mb = file.size / 1024 / 1024
      if (mb > maxMb) {
        setError(`File too large. Max ${maxMb}MB.`)
        return
      }
      setError(null)
      setUploading(true)
      setProgress(0)
      setDone(false)
      try {
        const url = await uploadFileToFirebase(file, (p) => setProgress(p), type)
        setProgress(100)
        setDone(true)
        onUploadComplete(url)
      } catch {
        setError('Upload failed. Please try again.')
      } finally {
        setUploading(false)
      }
    },
    [type, maxMb, onUploadComplete]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">{label}</p>

      {/* Current media preview */}
      {currentUrl && !uploading && (
        <div className="relative rounded-lg overflow-hidden border dark:border-neutral-700 border-neutral-200 h-40">
          {type === 'video' ? (
            <video src={currentUrl} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <img src={currentUrl} alt="Current hero background" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
            {type === 'video' && <Play className="w-5 h-5 text-white" aria-hidden="true" />}
            <span className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">Current {type}</span>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${type}`}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-5 cursor-pointer transition-all duration-200
          flex flex-col items-center justify-center gap-3 min-h-24
          ${
            isDragging
              ? 'border-sky-500 bg-sky-500/5'
              : 'dark:border-neutral-700 border-neutral-300 dark:hover:border-neutral-500 hover:border-neutral-400 dark:bg-neutral-900/50 bg-neutral-50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {uploading ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs dark:text-neutral-400 text-neutral-500">
              <span className="font-medium">Uploading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sky-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ) : done ? (
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-semibold">Upload complete</span>
          </div>
        ) : (
          <>
            <div className="w-9 h-9 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center">
              {type === 'video' ? (
                <Film className="w-4 h-4 dark:text-neutral-400 text-neutral-500" aria-hidden="true" />
              ) : (
                <ImageIcon className="w-4 h-4 dark:text-neutral-400 text-neutral-500" aria-hidden="true" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold dark:text-neutral-300 text-neutral-700">
                {isDragging ? `Drop ${type} here` : `Click or drag ${type}`}
              </p>
              <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                {type === 'video' ? 'MP4, WebM, MOV' : 'JPG, PNG, WebP'} · Max {maxMb}MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Reusable primitives ────────────────────────────────────────────── */
const Toggle = ({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    aria-pressed={enabled}
    aria-label={label}
    className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
  >
    {enabled ? (
      <ToggleRight className="w-8 h-8 text-sky-500 transition-colors" aria-hidden="true" />
    ) : (
      <ToggleLeft className="w-8 h-8 dark:text-neutral-600 text-neutral-400 transition-colors" aria-hidden="true" />
    )}
    <span
      className={`text-sm font-medium transition-colors ${enabled ? 'dark:text-white text-neutral-900' : 'dark:text-neutral-500 text-neutral-400'}`}
    >
      {label}
    </span>
  </button>
)

const Field = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  hint,
  rows
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  hint?: string
  rows?: number
}) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
    >
      {label}
    </label>
    {rows ? (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 placeholder:dark:text-neutral-600 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 placeholder:dark:text-neutral-600 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
      />
    )}
    {hint && <p className="text-xs dark:text-neutral-500 text-neutral-400">{hint}</p>}
  </div>
)

const SectionCard = ({
  icon: Icon,
  title,
  children,
  accent
}: {
  icon: any
  title: string
  children: React.ReactNode
  accent?: boolean
}) => (
  <div className="dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-neutral-200 rounded-xl overflow-hidden">
    <div
      className={`flex items-center gap-3 px-5 py-4 border-b dark:border-neutral-800 border-neutral-100 ${accent ? 'dark:bg-sky-500/5 bg-sky-50/50' : ''}`}
    >
      <div className="w-7 h-7 rounded-lg dark:bg-neutral-800 bg-neutral-100 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
      </div>
      <h2 className="text-xs font-bold dark:text-white text-neutral-900 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="p-5 space-y-5">{children}</div>
  </div>
)

/* ─── Main Component ─────────────────────────────────────────────────── */
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
      <div className="fixed bottom-0 left-0 right-0 z-20 dark:bg-neutral-950/95 bg-white/95 backdrop-blur-sm border-t dark:border-neutral-800 border-neutral-200 px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-black dark:text-white text-neutral-900 tracking-tight">Hero Studio</h1>
              <p className="text-xs dark:text-neutral-500 text-neutral-400">Homepage hero configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Save */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              aria-label={saving ? 'Saving...' : 'Save changes'}
              aria-busy={saving}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                saveState === 'success'
                  ? 'bg-emerald-500 text-white'
                  : saveState === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-linear-to-r from-sky-500 to-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>Saving...</span>
                </>
              ) : saveState === 'success' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Saved</span>
                </>
              ) : saveState === 'error' ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Error</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Two-column grid ───────────────────────────────────────────── */}
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
              <div className="space-y-2">
                <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">
                  Button 1
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    id="hero-cta1-text"
                    label="Text"
                    value={form.cta1Text ?? ''}
                    onChange={(v) => set('cta1Text', v)}
                    placeholder="Get Started"
                  />
                  <Field
                    id="hero-cta1-link"
                    label="Link"
                    value={form.cta1Link ?? ''}
                    onChange={(v) => set('cta1Link', v)}
                    placeholder="/donate"
                  />
                </div>
                <div className="flex items-center gap-1 p-1 dark:bg-neutral-800 bg-neutral-100 rounded-lg w-fit">
                  {(
                    [
                      { value: 'internal', icon: Link2, label: 'Internal' },
                      { value: 'external', icon: ExternalLink, label: 'External' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('cta1LinkType', opt.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                        form.cta1LinkType === opt.value
                          ? 'dark:bg-neutral-700 bg-white shadow dark:text-white text-neutral-900'
                          : 'dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-300'
                      }`}
                    >
                      <opt.icon className="w-3.5 h-3.5" aria-hidden="true" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA 2 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">
                    Button 2
                  </p>
                  <Toggle enabled={form.showCta2 ?? false} onChange={(v) => set('showCta2', v)} label="Show" />
                </div>

                <AnimatePresence>
                  {form.showCta2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <Field
                          id="hero-cta2-text"
                          label="Text"
                          value={form.cta2Text ?? ''}
                          onChange={(v) => set('cta2Text', v)}
                          placeholder="Learn More"
                        />
                        <Field
                          id="hero-cta2-link"
                          label="Link"
                          value={form.cta2Link ?? ''}
                          onChange={(v) => set('cta2Link', v)}
                          placeholder="/about"
                        />
                      </div>
                      <div className="flex items-center gap-1 p-1 dark:bg-neutral-800 bg-neutral-100 rounded-lg w-fit">
                        {(
                          [
                            { value: 'internal', icon: Link2, label: 'Internal' },
                            { value: 'external', icon: ExternalLink, label: 'External' }
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => set('cta2LinkType', opt.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                              form.cta2LinkType === opt.value
                                ? 'dark:bg-neutral-700 bg-white shadow dark:text-white text-neutral-900'
                                : 'dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-300'
                            }`}
                          >
                            <opt.icon className="w-3.5 h-3.5" aria-hidden="true" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>

            {/* Announcement Strip */}
            <SectionCard icon={Megaphone} title="Announcement Strip">
              <Toggle
                enabled={form.showAnnouncement ?? false}
                onChange={(v) => set('showAnnouncement', v)}
                label="Show announcement strip"
              />

              <AnimatePresence>
                {form.showAnnouncement && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-4"
                  >
                    <Field
                      id="announcement-text"
                      label="Announcement Text"
                      value={form.announcementText ?? ''}
                      onChange={(v) => set('announcementText', v)}
                      placeholder="Our Capital Campaign is underway!"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        id="announcement-link-label"
                        label="Link Label"
                        value={form.announcementLinkLabel ?? ''}
                        onChange={(v) => set('announcementLinkLabel', v)}
                        placeholder="Learn More"
                      />
                      <Field
                        id="announcement-link"
                        label="Link URL"
                        value={form.announcementLink ?? ''}
                        onChange={(v) => set('announcementLink', v)}
                        placeholder="/capital-campaign"
                      />
                      {eventIds.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">
                            Quick Insert — Event Link
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {eventIds.map((event) => (
                              <button
                                key={event.id}
                                type="button"
                                onClick={() => set('announcementLink', `/events/${event.id}`)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${form.announcementLink === `/events/${event.id}` ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-300 text-neutral-600 dark:hover:bg-neutral-700 hover:bg-neutral-200 border border-transparent'}`}
                                aria-label={`Insert link to ${event.title}`}
                                aria-pressed={form.announcementLink === `/events/${event.id}`}
                              >
                                <Link2 className="w-3 h-3 shrink-0" aria-hidden="true" />
                                {event.title}
                              </button>
                            ))}
                          </div>
                          {form.announcementLink?.startsWith('/events/') && (
                            <p className="text-[10px] font-mono dark:text-neutral-500 text-neutral-400">
                              {form.announcementLink}
                            </p>
                          )}
                        </div>
                      )}
                      {campaignIds.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">
                            Quick Insert — Campaign Link
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {campaignIds.map((campaign) => (
                              <button
                                key={campaign.id}
                                type="button"
                                onClick={() => set('announcementLink', `/campaigns/${campaign.id}`)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${form.announcementLink === `/campaigns/${campaign.id}` ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-300 text-neutral-600 dark:hover:bg-neutral-700 hover:bg-neutral-200 border border-transparent'}`}
                                aria-label={`Insert link to ${campaign.name}`}
                                aria-pressed={form.announcementLink === `/campaigns/${campaign.id}`}
                              >
                                <Link2 className="w-3 h-3 shrink-0" aria-hidden="true" />
                                {campaign.name}
                              </button>
                            ))}
                          </div>
                          {form.announcementLink?.startsWith('/campaigns/') && (
                            <p className="text-[10px] font-mono dark:text-neutral-500 text-neutral-400">
                              {form.announcementLink}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Link type */}
                    <div>
                      <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider mb-2">
                        Link Type
                      </p>
                      <div className="flex items-center gap-1 p-1 dark:bg-neutral-800 bg-neutral-100 rounded-lg w-fit">
                        {(
                          [
                            { value: 'internal', icon: Link2, label: 'Internal' },
                            { value: 'external', icon: ExternalLink, label: 'External' }
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => set('announcementLinkType', opt.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                              form.announcementLinkType === opt.value
                                ? 'dark:bg-neutral-700 bg-white shadow dark:text-white text-neutral-900'
                                : 'dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-300'
                            }`}
                          >
                            <opt.icon className="w-3.5 h-3.5" aria-hidden="true" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gradient colors */}
                    <div>
                      <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider mb-2">
                        Gradient Colors
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {(
                          [
                            { id: 'color1', label: 'Color 1', key: 'announcementColor1', fallback: '#0ea5e9' },
                            { id: 'color2', label: 'Color 2', key: 'announcementColor2', fallback: '#6366f1' }
                          ] as const
                        ).map((c) => (
                          <div key={c.id} className="space-y-1.5">
                            <label
                              htmlFor={c.id}
                              className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                            >
                              {c.label}
                            </label>
                            <div className="flex items-center gap-2.5 px-3 py-2 dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-neutral-200 rounded-lg">
                              <input
                                id={c.id}
                                type="color"
                                value={form[c.key] ?? c.fallback}
                                onChange={(e) => set(c.key, e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                                aria-label={`Announcement gradient ${c.label}`}
                              />
                              <span className="text-xs font-mono dark:text-neutral-300 text-neutral-700">
                                {form[c.key] ?? c.fallback}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live preview */}
                    {form.announcementText && (
                      <div className="rounded-lg overflow-hidden border dark:border-neutral-700 border-neutral-200">
                        <p className="text-[10px] font-semibold dark:text-neutral-500 text-neutral-400 uppercase tracking-widest px-3 py-1.5 dark:bg-neutral-800 bg-neutral-50">
                          Preview
                        </p>
                        <div
                          className="px-4 py-2.5 flex items-center justify-center gap-2 flex-wrap text-white text-sm"
                          style={{
                            backgroundImage: `linear-gradient(270deg, ${form.announcementColor1 ?? '#0ea5e9'}, ${form.announcementColor2 ?? '#6366f1'}, ${form.announcementColor1 ?? '#0ea5e9'})`,
                            backgroundSize: '400% 400%',
                            animation: 'gradientShift 6s ease infinite'
                          }}
                        >
                          <span>{form.announcementText}</span>
                          {form.announcementLinkLabel && (
                            <span className="font-semibold underline underline-offset-2 flex items-center gap-1">
                              {form.announcementLinkLabel}
                              {form.announcementLinkType === 'external' && (
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>
          </div>

          {/* ── RIGHT COLUMN — background + countdown ────────────────── */}
          <div className="space-y-6">
            {/* Background */}
            <SectionCard icon={ImageIcon} title="Background">
              {/* Type switcher */}
              <div>
                <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider mb-2">
                  Type
                </p>
                <div className="flex items-center gap-1 p-1 dark:bg-neutral-800 bg-neutral-100 rounded-lg w-fit">
                  {(['video', 'image'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('backgroundType', t)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                        form.backgroundType === t
                          ? 'dark:bg-neutral-700 bg-white shadow dark:text-white text-neutral-900'
                          : 'dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-300'
                      }`}
                    >
                      {t === 'video' ? (
                        <Film className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {form.backgroundType === 'video' ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <UploadZone
                      type="video"
                      currentUrl={form.backgroundVideo ?? ''}
                      onUploadComplete={(url) => set('backgroundVideo', url)}
                      label="Hero Video"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <UploadZone
                      type="image"
                      currentUrl={form.backgroundImage ?? ''}
                      onUploadComplete={(url) => set('backgroundImage', url)}
                      label="Hero Image"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Overlay opacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="overlay-opacity"
                    className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                  >
                    Overlay Opacity
                  </label>
                  <span className="text-xs font-mono dark:text-neutral-400 text-neutral-500">
                    {Math.round((form.overlayOpacity ?? 0.5) * 100)}%
                  </span>
                </div>
                <input
                  id="overlay-opacity"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={form.overlayOpacity ?? 0.5}
                  onChange={(e) => set('overlayOpacity', parseFloat(e.target.value))}
                  className="w-full accent-sky-500"
                  aria-label="Background overlay opacity"
                />
                <div className="flex justify-between text-[10px] dark:text-neutral-600 text-neutral-400">
                  <span>Transparent</span>
                  <span>Opaque</span>
                </div>
              </div>
            </SectionCard>

            {/* Countdown */}
            <SectionCard icon={Timer} title="Countdown">
              <Toggle
                enabled={form.showCountdown ?? false}
                onChange={(v) => set('showCountdown', v)}
                label="Show countdown timer"
              />

              <AnimatePresence>
                {form.showCountdown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        id="countdown-date"
                        label="Target Date"
                        type="date"
                        value={form.countdownDate ?? ''}
                        onChange={(v) => set('countdownDate', v)}
                      />
                      <Field
                        id="countdown-label"
                        label="Label"
                        value={form.countdownLabel ?? ''}
                        onChange={(v) => set('countdownLabel', v)}
                        placeholder="Event Starts In"
                      />
                    </div>

                    {/* Countdown preview */}
                    {form.countdownDate && (
                      <div className="rounded-lg border dark:border-neutral-700 border-neutral-200 overflow-hidden">
                        <p className="text-[10px] font-semibold dark:text-neutral-500 text-neutral-400 uppercase tracking-widest px-3 py-1.5 dark:bg-neutral-800 bg-neutral-50">
                          Preview
                        </p>
                        <div className="p-4 dark:bg-neutral-900 bg-neutral-50 flex flex-col items-center gap-3">
                          <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-widest">
                            {form.countdownLabel || 'Event Starts In'}
                          </p>
                          <div className="flex items-center gap-2">
                            {['DD', 'HH', 'MM', 'SS'].map((unit) => (
                              <div key={unit} className="flex flex-col items-center gap-1">
                                <div className="w-11 h-11 dark:bg-neutral-800 bg-white border dark:border-neutral-700 border-neutral-200 rounded-lg flex items-center justify-center">
                                  <span className="text-base font-black dark:text-white text-neutral-900">--</span>
                                </div>
                                <span className="text-[9px] dark:text-neutral-500 text-neutral-400 font-semibold uppercase tracking-wider">
                                  {unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>

            {/* Thermometer */}
            <SectionCard icon={Target} title="Thermometer Widget">
              <Toggle
                enabled={form.showThermometer ?? false}
                onChange={(v) => set('showThermometer', v)}
                label="Show thermometer widget"
              />

              <AnimatePresence>
                {form.showThermometer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-4"
                  >
                    <Field
                      id="thermometer-label"
                      label="Label"
                      value={form.thermometerLabel ?? ''}
                      onChange={(v) => set('thermometerLabel', v)}
                      placeholder="Campaign Progress"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="thermo-goal"
                          className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                        >
                          Goal ($)
                        </label>
                        <input
                          id="thermo-goal"
                          type="number"
                          min={0}
                          value={form.thermometerGoal ?? 100000}
                          onChange={(e) => set('thermometerGoal', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="thermo-current"
                          className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                        >
                          Raised ($)
                        </label>
                        <input
                          id="thermo-current"
                          type="number"
                          min={0}
                          value={form.thermometerCurrent ?? 0}
                          onChange={(e) => set('thermometerCurrent', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Color picker */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="thermo-color"
                        className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                      >
                        Color
                      </label>
                      <div className="flex items-center gap-2.5 px-3 py-2 dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-neutral-200 rounded-lg w-fit">
                        <input
                          id="thermo-color"
                          type="color"
                          value={form.thermometerColor ?? '#0ea5e9'}
                          onChange={(e) => set('thermometerColor', e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                          aria-label="Thermometer color"
                        />
                        <span className="text-xs font-mono dark:text-neutral-300 text-neutral-700">
                          {form.thermometerColor ?? '#0ea5e9'}
                        </span>
                      </div>
                    </div>

                    {/* Progress readout */}
                    <div className="dark:bg-neutral-800 bg-neutral-100 rounded-lg px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="dark:text-neutral-400 text-neutral-500 font-medium">Progress</span>
                        <span className="font-bold dark:text-white text-neutral-900">
                          {Math.min(
                            Math.round(((form.thermometerCurrent ?? 0) / (form.thermometerGoal || 1)) * 100),
                            100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full h-2 dark:bg-neutral-700 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(((form.thermometerCurrent ?? 0) / (form.thermometerGoal || 1)) * 100, 100)}%`,
                            backgroundColor: form.thermometerColor ?? '#0ea5e9'
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] dark:text-neutral-500 text-neutral-400 font-mono">
                        <span>${(form.thermometerCurrent ?? 0).toLocaleString()} raised</span>
                        <span>${(form.thermometerGoal ?? 0).toLocaleString()} goal</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>

            {/* Growth Tree */}
            <SectionCard icon={Leaf} title="Growth Tree Widget">
              <Toggle
                enabled={form.showGrowthTree ?? false}
                onChange={(v) => set('showGrowthTree', v)}
                label="Show growth tree widget"
              />

              <AnimatePresence>
                {form.showGrowthTree && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-4"
                  >
                    <Field
                      id="tree-label"
                      label="Label"
                      value={form.growthTreeLabel ?? ''}
                      onChange={(v) => set('growthTreeLabel', v)}
                      placeholder="Community Members"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="tree-current"
                          className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                        >
                          Current
                        </label>
                        <input
                          id="tree-current"
                          type="number"
                          min={0}
                          value={form.growthTreeCurrent ?? 0}
                          onChange={(e) => set('growthTreeCurrent', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="tree-goal"
                          className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                        >
                          Goal
                        </label>
                        <input
                          id="tree-goal"
                          type="number"
                          min={0}
                          value={form.growthTreeGoal ?? 10000}
                          onChange={(e) => set('growthTreeGoal', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="tree-color"
                        className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                      >
                        Color
                      </label>
                      <div className="flex items-center gap-2.5 px-3 py-2 dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-neutral-200 rounded-lg w-fit">
                        <input
                          id="tree-color"
                          type="color"
                          value={form.growthTreeColor ?? '#10b981'}
                          onChange={(e) => set('growthTreeColor', e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                          aria-label="Growth tree color"
                        />
                        <span className="text-xs font-mono dark:text-neutral-300 text-neutral-700">
                          {form.growthTreeColor ?? '#10b981'}
                        </span>
                      </div>
                    </div>

                    {/* Progress readout */}
                    <div className="dark:bg-neutral-800 bg-neutral-100 rounded-lg px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="dark:text-neutral-400 text-neutral-500 font-medium">Progress</span>
                        <span className="font-bold dark:text-white text-neutral-900">
                          {Math.min(
                            Math.round(((form.growthTreeCurrent ?? 0) / (form.growthTreeGoal || 1)) * 100),
                            100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full h-2 dark:bg-neutral-700 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(((form.growthTreeCurrent ?? 0) / (form.growthTreeGoal || 1)) * 100, 100)}%`,
                            backgroundColor: form.growthTreeColor ?? '#10b981'
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] dark:text-neutral-500 text-neutral-400 font-mono">
                        <span>{(form.growthTreeCurrent ?? 0).toLocaleString()} current</span>
                        <span>{(form.growthTreeGoal ?? 0).toLocaleString()} goal</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}
