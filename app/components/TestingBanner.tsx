'use client'

import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function TestingBanner() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || pathname.startsWith('/admin')) return null

  return (
    <div className="anim-gradient-bg bg-linear-to-r fixed top-0 left-0 from-purple-500 to-indigo-600 dark:bg-indigo-600 z-105 w-full text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <p className="text-sm sm:text-base font-semibold">
            <span className="hidden sm:inline">Site Testing Mode: </span>
            Donations will be available starting tomorrow, January 30th, 2026
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
