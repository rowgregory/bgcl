'use client'

export const Hero = ({ initialPageData }) => {
  return (
    <div className="w-full h-225 overflow-hidden -mt-37.5 relative">
      {/* YouTube Video Background */}

      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-130">
        <source src="/videos/landing.mov" type="video/mp4" className="w-full h-full object-cover" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Right Column - Text */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight uppercase tracking-tight text-white font-quicksand font-bold">
              {initialPageData?.cta?.heading}
            </h1>

            <p className="text-lg text-white leading-relaxed max-w-xl">{initialPageData?.cta.bodyText}</p>

            {initialPageData?.cta && (
              <a
                href={initialPageData?.cta.buttonLink}
                className="inline-flex items-center gap-2 border-3 border-sky-600 hover:bg-sky-700 text-white px-8 py-4 font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/50 group "
              >
                {initialPageData?.cta.buttonText}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm font-medium">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  )
}
