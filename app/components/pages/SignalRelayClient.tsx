'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Mail, Search } from 'lucide-react'
import { deleteSubscriber } from '@/app/lib/actions/subscriber/deleteSubscriber'
import { useRouter } from 'next/navigation'
import { store } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'

const TABS = ['All', 'Members', 'Non-Members', 'Donors'] as const
type TabType = (typeof TABS)[number]

const TAB_TO_TYPE = {
  All: 'All' as const,
  Members: 'member' as const,
  'Non-Members': 'non-member' as const,
  Donors: 'donor' as const
}

export default function SignalRelayClient({ subscribers }) {
  //   const [copied, setCopied] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filterByTab = (tab: TabType) => {
    setActiveTab(tab)
  }

  //   const copyEmails = async () => {
  //     const emails = subscribers?.map((sub) => sub.email).join('; ')
  //     try {
  //       await navigator.clipboard.writeText(emails)
  //       setCopied(true)
  //       setTimeout(() => setCopied(false), 2000)
  //     } catch (error) {
  //     }
  //   }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      await deleteSubscriber(id)
      router.refresh()
      setDeleteId(null)
      store.dispatch(showToast({ message: 'Subscriber deleted successfully!' }))
    } catch {
      store.dispatch(showToast({ message: 'Failed to delete subscriber.', type: 'error' }))
    }
  }

  const filteredSubscribers = subscribers?.filter((subscriber) => {
    const matchesTab = TAB_TO_TYPE[activeTab] === 'All' || subscriber?.type === TAB_TO_TYPE[activeTab]

    const matchesSearch = searchQuery === '' || subscriber.email?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const typeColors = {
    member: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'non-member': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    donor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  }

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <div className="fixed w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8 pb-3 lg:pb-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-3 lg:gap-x-8">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => filterByTab(tab)}
                className={`py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab
                    ? 'dark:text-white text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-sky-600"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyEmails}
            disabled={subscribers?.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 dark:disabled:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </motion.button> */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-6 pt-36 lg:pt-17">
        <div className="mx-auto">
          {filteredSubscribers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
              <Mail className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">No subscribers</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Subscriber List */}
              {filteredSubscribers?.map((subscriber, index) => (
                <motion.div
                  key={subscriber.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold dark:text-white text-neutral-900 truncate">{subscriber.email}</p>
                        <span
                          className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold shrink-0 ${
                            typeColors[subscriber.type]
                          }`}
                        >
                          {subscriber.type === 'member'
                            ? 'Member'
                            : subscriber.type === 'non-member'
                              ? 'Non-Member'
                              : 'Donor'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        Subscribed {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleDelete(subscriber.id)
                        setDeleteId(subscriber.id)
                      }}
                      className="shrink-0 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-all p-2"
                    >
                      {deleting && deleteId === subscriber.id ? (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-300 dark:border-neutral-600 border-t-red-600 dark:border-t-red-400 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
