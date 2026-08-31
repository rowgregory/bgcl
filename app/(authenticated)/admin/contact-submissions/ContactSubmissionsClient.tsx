'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ContactSubmission } from '@prisma/client'
import { formatDate } from '@/lib/utils/date-utils'
import { useContactSubmissionDrawer } from '@/stores/drawers'
import { ContactSubmissionDrawer } from './_components/ContactSubmissionDrawer'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { sentenceCase } from '@/lib/utils/sentenceCase'

const FILTERS = ['All', 'New', 'Read', 'Archived', 'Volunteer', 'Contact'] as const
type FilterType = (typeof FILTERS)[number]

const STATUS_DOT: Record<string, string> = {
  NEW: 'bg-sky-500',
  READ: 'bg-emerald-500',
  ARCHIVED: 'bg-neutral-300 dark:bg-neutral-700'
}

const thCls =
  'py-2 pr-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider whitespace-nowrap'

export default function ContactSubmissionsClient({ contactSubmissions }: { contactSubmissions: ContactSubmission[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const open = useContactSubmissionDrawer((s) => s.open)

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return contactSubmissions.filter((t) => {
      const matchesFilter =
        activeFilter === 'All' ||
        t.status === activeFilter.toUpperCase() ||
        (activeFilter === 'Volunteer' && t.type === 'VOLUNTEER') ||
        (activeFilter === 'Contact' && t.type === 'GENERAL')

      if (!matchesFilter) return false
      if (!q) return true

      return (
        t.firstName?.toLowerCase().includes(q) ||
        t.lastName?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q)
      )
    })
  }, [contactSubmissions, activeFilter, searchQuery])

  const counts = useMemo(
    () => ({
      All: contactSubmissions.length,
      New: contactSubmissions.filter((t) => t.status === 'NEW').length,
      Read: contactSubmissions.filter((t) => t.status === 'READ').length,
      Archived: contactSubmissions.filter((t) => t.status === 'ARCHIVED').length,
      Volunteer: contactSubmissions.filter((t) => t.type === 'VOLUNTEER').length,
      Contact: contactSubmissions.filter((t) => t.type === 'GENERAL').length
    }),
    [contactSubmissions]
  )

  const isFiltered = activeFilter !== 'All' || searchQuery.trim().length > 0

  return (
    <>
      <ContactSubmissionDrawer />

      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <AdminPageHeader
          title="Contact Submissions"
          meta={counts.New > 0 ? `${counts.New} new · ${counts.All} total` : `${counts.All} total`}
        />

        <div className="px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 pt-5">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search submissions by name, email, or subject"
                placeholder="Search name, email, or subject"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as FilterType)}
              aria-label="Filter submissions"
              className="py-1.5 pl-2.5 pr-8 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {FILTERS.map((filter) => (
                <option key={filter} value={filter}>
                  {filter} ({counts[filter]})
                </option>
              ))}
            </select>

            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setActiveFilter('All')
                }}
                className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="pt-4 pb-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-sm" aria-label="Contact submissions">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th scope="col" className={`text-left ${thCls}`}>
                      Name
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      Email
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      Phone
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      Type
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      Received
                    </th>
                    <th scope="col" className={`text-left ${thCls} pr-0`}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                        {isFiltered
                          ? 'No submissions match this filter.'
                          : 'Messages from the contact form will appear here.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => open(t)}
                        className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="py-3 pr-4 whitespace-nowrap text-neutral-900 dark:text-white">
                          {[t.firstName, t.lastName].filter(Boolean).join(' ') || '—'}
                        </td>

                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 max-w-56 truncate">
                          {t.email ?? '—'}
                        </td>

                        <td className="py-3 pr-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400 tabular-nums">
                          {t.phone || '—'}
                        </td>

                        <td className="py-3 pr-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                          {t.type === 'VOLUNTEER' ? 'Volunteer' : 'Contact'}
                        </td>

                        <td className="py-3 pr-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400 tabular-nums">
                          <time dateTime={new Date(t.createdAt).toISOString()}>{formatDate(t.createdAt)}</time>
                        </td>

                        <td className="py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[t.status] ?? 'bg-neutral-300'}`}
                              aria-hidden="true"
                            />
                            {sentenceCase(t.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
