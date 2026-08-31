'use client'

import { useState, useMemo } from 'react'
import { Trash2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteSubscriber } from '@/lib/actions/subscriber/deleteSubscriber'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'

const TABS = ['All', 'Members', 'Non-Members', 'Donors'] as const
type TabType = (typeof TABS)[number]

const TAB_TO_TYPE = {
  All: 'All' as const,
  Members: 'member' as const,
  'Non-Members': 'non-member' as const,
  Donors: 'donor' as const
}

const TYPE_LABEL: Record<string, string> = {
  member: 'Member',
  'non-member': 'Non-member',
  donor: 'Donor'
}

const thCls =
  'py-2 pr-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider whitespace-nowrap'

export default function NewsletterEmailsClient({ subscribers }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [message, setMessage] = useState<InlineMessageState | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()

  const handleDelete = async (id: string) => {
    setMessage(null)
    setDeleteId(id)

    try {
      const res = await deleteSubscriber(id)

      if (res && res.success === false) {
        setMessage({
          type: 'error',
          message: 'Could not delete the subscriber.',
          description: extractErrorMessage(res)
        })
        return
      }

      router.refresh()
      setMessage({ type: 'success', message: 'Subscriber deleted.' })
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        message: 'Could not delete the subscriber.',
        description: extractErrorMessage(error)
      })
    } finally {
      setDeleteId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return (subscribers ?? []).filter((subscriber) => {
      if (TAB_TO_TYPE[activeTab] !== 'All' && subscriber?.type !== TAB_TO_TYPE[activeTab]) return false
      if (!q) return true

      return subscriber.email?.toLowerCase().includes(q)
    })
  }, [subscribers, activeTab, searchQuery])

  const isFiltered = searchQuery.trim().length > 0 || activeTab !== 'All'

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title="Newsletter Emails"
        meta={`${filtered.length} ${filtered.length === 1 ? 'subscriber' : 'subscribers'}`}
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
              aria-label="Search subscribers by email"
              placeholder="Search email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as TabType)}
            aria-label="Filter by subscriber type"
            className="py-1.5 pl-2.5 pr-8 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {TABS.map((tab) => {
              const type = TAB_TO_TYPE[tab]
              const count =
                type === 'All' ? (subscribers ?? []).length : (subscribers ?? []).filter((s) => s.type === type).length

              return (
                <option key={tab} value={tab}>
                  {tab} ({count})
                </option>
              )
            })}
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveTab('All')
              }}
              className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="pt-4 pb-6">
          <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-4" />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th scope="col" className={`text-left ${thCls}`}>
                    Email
                  </th>
                  <th scope="col" className={`text-left ${thCls}`}>
                    Type
                  </th>
                  <th scope="col" className={`text-left ${thCls}`}>
                    Subscribed
                  </th>
                  <th scope="col" className={`text-right ${thCls} pr-0`}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                      {isFiltered
                        ? 'No subscribers match this filter.'
                        : 'Subscribers will appear here as people sign up.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="py-3 pr-4 text-neutral-900 dark:text-white max-w-96 truncate">
                        {subscriber.email}
                      </td>

                      <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {TYPE_LABEL[subscriber.type] ?? subscriber.type}
                      </td>

                      <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap tabular-nums">
                        {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          timeZone: 'America/New_York'
                        })}
                      </td>

                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(subscriber.id)}
                          disabled={deleteId !== null}
                          aria-label={`Delete ${subscriber.email}`}
                          className="p-1.5 rounded text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 hover:text-red-500! dark:hover:text-red-400! transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        >
                          {deleteId === subscriber.id ? (
                            <span className="block w-4 h-4 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-red-500 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
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
  )
}
