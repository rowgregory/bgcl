'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'

export const Hero = ({ initialPageData }) => {
  return (
    <div className="w-full h-225 overflow-hidden -mt-37.5 relative">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-130"
      >
        <source src="/videos/landing.mov" type="video/mp4" className="w-full h-full object-cover" />
      </video>

      {/* Dark Overlay - Light/Dark Mode */}
      <div className="absolute inset-0 bg-linear-to-r from-black/20 via-black/40 to-black/20 dark:from-black/50 dark:via-black/70 dark:to-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl w-full gap-12 items-center">
          {/* Text Content */}
          <div
            className="flex flex-col justify-start items-start sm:justify-center sm:items-center space-y-6 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight uppercase tracking-tight text-white font-bold">
              {initialPageData?.hero?.heading}
            </h1>

            <p className="text-lg lg:text-center text-white leading-relaxed">{initialPageData?.hero?.bodyText}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-y-3 sm:gap-x-3">
              {/* Primary Button */}
              <Link
                href={initialPageData?.hero?.button1Link}
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white border-2 border-sky-600 dark:border-sky-600 px-8 py-3 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-sky-600/50 dark:hover:shadow-sky-500/50 group"
              >
                {initialPageData?.hero?.button1Text}
              </Link>

              {/* Secondary Button */}
              {initialPageData?.hero && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={initialPageData?.hero?.button2Link}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent hover:bg-sky-700 dark:hover:bg-sky-700 text-white border-2 border-white hover:border-sky-600 dark:border-white dark:hover:border-sky-600 px-8 py-3 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-sky-600/50 dark:hover:shadow-sky-500/50 group"
                >
                  <Heart className="text-white w-4 h-4" />
                  {initialPageData?.hero?.button2Text}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
