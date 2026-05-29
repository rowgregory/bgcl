'use client'

import { SubNavLink } from '@/app/components/navigation/SubNavLink'
import { generateEventsReport } from '@/app/lib/actions/generateEventsReport'
import { getCapsuleNavLinks } from '@/app/lib/utils/getCapsuleNavLinks'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function CapsuleLayout({ children }) {
  const path = usePathname()
  const [loading, setLoading] = useState(false)

  const isEventDetailsPage = path.includes('/admin/capsule/events/')

  const handleExportEvents = async () => {
    setLoading(true)
    try {
      const result = await generateEventsReport({
        // Add filters here if needed
        // startDate: new Date('2024-01-01'),
        // endDate: new Date()
      })

      if (result.success && result.pdf) {
        // Open PDF in new tab
        const link = document.createElement('a')
        link.href = result.pdf
        link.download = `events-report-${new Date().toISOString().split('T')[0]}.pdf`
        link.click()
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (isEventDetailsPage) {
    return <>{children}</>
  }

  return (
    <>
      {/* Navigation */}
      <div className="fixed top-18 lg:top-15 w-[calc(100vw-255px)] z-10 dark:bg-zinc-900/50 dark:backdrop-blur-sm dark:border-zinc-700/30 bg-white/50 backdrop-blur-sm border-neutral-200/30 border-b">
        <div className="px-2 xs:px-3 sm:px-6">
          <nav className="flex items-center justify-between py-2 xs:py-3 sm:py-4 overflow-x-auto scrollbar-none w-full">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 lg:space-x-8 min-w-max">
              {getCapsuleNavLinks(path).map((item) => (
                <SubNavLink key={item.linkKey} handleNav={() => {}} item={item} />
              ))}
            </div>
            {/* EXPORT BUTTON */}
            <button
              disabled={loading}
              onClick={handleExportEvents}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border border-sky-200 dark:border-sky-800 bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-neutral-800 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                  Exporting...
                </>
              ) : (
                'Export'
              )}
            </button>
          </nav>
        </div>
      </div>
      <main className="pt-17">{children}</main>
    </>
  )
}
