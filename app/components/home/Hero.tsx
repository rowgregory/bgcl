'use client'

import { ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'

export const Hero = ({ hero }) => {
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight uppercase tracking-tight text-white font-bold text-left sm:text-center">
              {hero?.heading}
            </h1>

            <p className="text-lg lg:text-center text-white leading-relaxed">{hero?.bodyText}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-y-3 sm:gap-x-3">
              {/* Primary Button */}
              <Link
                href={hero?.button1Link}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-2xl transition-all overflow-hidden h-15"
              >
                <div className="absolute inset-0 bg-linear-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <span className="relative z-10">{hero?.button1Text}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary Button */}

              <a
                target="_blank"
                rel="noopener noreferrer"
                href={hero?.button2Link}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm border-2 border-white/20 dark:border-white/10 hover:border-sky-500/50 text-white dark:text-white font-semibold rounded-2xl transition-all h-15"
              >
                <Heart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                {hero?.button2Text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
