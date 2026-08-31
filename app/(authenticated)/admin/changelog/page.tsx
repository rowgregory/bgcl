'use client'

import { useState, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { changelogData, TYPE_DOT } from './_constants/changelog-data.constants'

const formatEntryDate = (date: string) =>
  new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York'
  })

export default function ChangelogPage() {
  const latest = changelogData[0]
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const toggle = (version: string) => setExpanded((prev) => ({ ...prev, [version]: !prev[version] }))

  const jumpTo = (version: string) => {
    setExpanded((prev) => ({ ...prev, [version]: true }))

    // Wait for the section to expand before measuring its position
    requestAnimationFrame(() => {
      sectionRefs.current[version]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader title="Changelog" meta={latest ? `Latest v${latest.version}` : undefined} />

      <div className="px-6 py-8 lg:px-8">
        <div className="flex gap-10">
          <nav aria-label="Versions" className="hidden lg:block w-28 shrink-0">
            <div className="sticky top-19 space-y-0.5">
              {changelogData.map((entry) => (
                <button
                  key={entry.version}
                  type="button"
                  onClick={() => jumpTo(entry.version)}
                  className={`block w-full text-left px-2 py-1 rounded text-[13px] tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    expanded[entry.version]
                      ? 'text-neutral-900 dark:text-white font-medium'
                      : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  v{entry.version}
                </button>
              ))}
            </div>
          </nav>

          <div className="min-w-0 flex-1 max-w-3xl">
            {changelogData.map((entry) => {
              const isOpen = expanded[entry.version] ?? false

              return (
                <section
                  key={entry.version}
                  ref={(el) => {
                    sectionRefs.current[entry.version] = el
                  }}
                  className="scroll-mt-20"
                >
                  <button
                    type="button"
                    onClick={() => toggle(entry.version)}
                    aria-expanded={isOpen}
                    className="w-full flex items-baseline gap-3 py-3 border-b border-neutral-200 dark:border-neutral-800 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 self-center text-neutral-400 dark:text-neutral-600 transition-transform ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                      aria-hidden="true"
                    />

                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                      v{entry.version}
                    </h2>

                    <time dateTime={entry.date} className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                      {formatEntryDate(entry.date)}
                    </time>

                    <span className="text-xs text-neutral-400 dark:text-neutral-600 ml-auto tabular-nums">
                      {entry.changes.length} {entry.changes.length === 1 ? 'change' : 'changes'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-900 pl-6">
                      {entry.changes.map((change, i) => (
                        <div key={i} className="py-4">
                          <div className="flex items-baseline gap-2.5 mb-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 self-center ${TYPE_DOT[change.type] ?? 'bg-neutral-300'}`}
                              aria-hidden="true"
                            />

                            <h3 className="text-[13px] font-medium text-neutral-900 dark:text-white">{change.title}</h3>

                            <span className="text-xs text-neutral-400 dark:text-neutral-600 capitalize">
                              {change.type}
                              {change.impact === 'high' && (
                                <span className="text-amber-600 dark:text-amber-400"> · high impact</span>
                              )}
                            </span>
                          </div>

                          <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed pl-4">
                            {change.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
