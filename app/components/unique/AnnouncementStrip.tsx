'use client'

import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { IHero } from '@/types/entities/hero'
import { HIDDEN_PATHS } from '@/app/lib/constants/navigation'
import { usePathname } from 'next/navigation'

interface AnnouncementStripProps {
  hero: IHero | null
}

export const AnnouncementStrip = ({ hero }: AnnouncementStripProps) => {
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()
  const show = !HIDDEN_PATHS.some((path) => pathname.startsWith(path))

  if (!hero?.showAnnouncement || !hero?.announcementText || dismissed || !show) return null

  const hasLink = !!hero.announcementLink && !!hero.announcementLinkLabel
  const isExternal = hero.announcementLinkType === 'external'

  return (
    <div
      role="banner"
      aria-label="Site announcement"
      className="relative z-50 flex items-center justify-center gap-3 px-10 py-2.5 text-white text-sm font-medium"
      style={{
        backgroundImage: `linear-gradient(270deg, ${hero.announcementColor1}, ${hero.announcementColor2}, ${hero.announcementColor1})`,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 6s ease infinite'
      }}
    >
      {/* Text */}
      <p className="text-center leading-snug">{hero.announcementText}</p>

      {/* Link */}
      {hasLink &&
        (isExternal ? (
          <a
            href={hero.announcementLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${hero.announcementLinkLabel} — opens in a new tab`}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
          >
            {hero.announcementLinkLabel}
            <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
          </a>
        ) : (
          <Link
            href={hero.announcementLink}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
          >
            {hero.announcementLinkLabel}
          </Link>
        ))}

      {/* Dismiss */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
