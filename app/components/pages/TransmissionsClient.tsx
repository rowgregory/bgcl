'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Phone, CheckCircle, Archive, Trash2, Search, Heart, X } from 'lucide-react'
import { updateContactSubmissionStatus } from '@/app/lib/actions/updateContactSubmissionStatus'
import { store } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useRouter } from 'next/navigation'
import { deleteContactSubmission } from '@/app/lib/actions/deleteContactSubmission'

const TABS = ['All', 'New', 'Read', 'Archived']

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export default function TransmissionsClient({ transmissions }: { transmissions: IContactSubmission[] }) {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const filterByTab = (tab: string) => {
    setActiveTab(tab)
  }

  const filteredTransmissions = transmissions.filter((transmission) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'New' && transmission.status === 'NEW') ||
      (activeTab === 'Read' && transmission.status === 'READ') ||
      (activeTab === 'Archived' && transmission.status === 'ARCHIVED')

    const matchesSearch =
      searchQuery === '' ||
      transmission.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transmission.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transmission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transmission.subject.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const updateStatus = async (id: string, status: 'READ' | 'ARCHIVED') => {
    try {
      await updateContactSubmissionStatus(id, status)
      store.dispatch(showToast({ message: `Transmission status updated to ${status}` }))
      router.refresh()
    } catch (error) {
      store.dispatch(showToast({ message: `Failed to update transmission status to ${status}`, type: 'error' }))
    }
  }

  const deleteTransmission = async (id: string) => {
    try {
      await deleteContactSubmission(id)
      store.dispatch(showToast({ message: `Transmission deleted!` }))
      router.refresh()
    } catch (error) {
      store.dispatch(showToast({ message: `Failed to delete transmission.`, type: 'error' }))
    }
  }

  const stats = {
    total: transmissions.length,
    new: transmissions.filter((t: { status: string }) => t.status === 'NEW').length,
    read: transmissions.filter((t: { status: string }) => t.status === 'READ').length,
    archived: transmissions.filter((t: { status: string }) => t.status === 'ARCHIVED').length
  }

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col">
      {/* Tabs */}
      <div className="fixed w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8 z-10 pb-3 lg:pb-0">
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
                {tab === 'New' && stats.new > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-sky-500 text-white rounded-full">{stats.new}</span>
                )}
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
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search transmissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-6 pt-36 lg:pt-17">
        <div className="mx-auto">
          {/* Stats */}
          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Total:</span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">New:</span>
              <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">{stats.new}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Read:</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{stats.read}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Archived:</span>
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{stats.archived}</span>
            </div>
          </div>

          {filteredTransmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">No transmissions</p>
              <p className="text-sm">Incoming messages will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTransmissions.map((transmission: IContactSubmission, index: number) => (
                <motion.div
                  key={transmission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <div className="h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    {/* Header with Type & Status */}
                    <div
                      className={`px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 ${
                        transmission.type === 'VOLUNTEER'
                          ? 'bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30'
                          : 'bg-linear-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {transmission.type === 'VOLUNTEER' ? (
                            <>
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                <Heart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                                  Volunteer Application
                                </span>
                                <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
                                  {formatDate(transmission.createdAt)}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                              </div>
                              <div>
                                <span className="text-sm capitalize font-semibold text-sky-900 dark:text-sky-100 line-clamp-1">
                                  Subject: {transmission.subject}
                                </span>
                                <p className="text-xs text-sky-600/70 dark:text-sky-400/70">
                                  {formatDate(transmission.createdAt)}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            transmission.status === 'NEW'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                              : transmission.status === 'READ'
                                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {transmission.status}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4 flex-1">
                      {/* Contact Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                          <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                            {transmission.firstName?.[0]}
                            {transmission.lastName?.[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 dark:text-white truncate">
                            {transmission.firstName} {transmission.lastName}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                            {transmission.email}
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      {transmission.phone && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Phone className="w-4 h-4" />
                          <span>{transmission.phone}</span>
                        </div>
                      )}

                      {/* Volunteer Details */}
                      {transmission.type === 'VOLUNTEER' && (
                        <div className="grid grid-cols-2 gap-2">
                          {transmission.programInterests && (
                            <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">Program</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                                {transmission.programInterests.replace('-', ' ')}
                              </p>
                            </div>
                          )}
                          {transmission.availabilityDays && (
                            <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">Days</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                {transmission.availabilityDays}
                              </p>
                            </div>
                          )}
                          {transmission.availabilityHours && (
                            <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">Hours</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                                {transmission.availabilityHours}
                              </p>
                            </div>
                          )}
                          {transmission.yearsExperience && (
                            <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">Experience</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                {transmission.yearsExperience} years
                              </p>
                            </div>
                          )}
                          <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg col-span-2">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Background Check</p>
                            <p
                              className={`text-sm font-medium flex items-center gap-1.5 ${
                                transmission.backgroundCheckAck
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {transmission.backgroundCheckAck ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" /> Acknowledged
                                </>
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5" /> Not Acknowledged
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Message / Additional Info */}
                      {(transmission.message || transmission.additionalInfo) && (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                          {transmission.message && (
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap line-clamp-4">
                              {transmission.message}
                            </p>
                          )}
                          {transmission.additionalInfo && (
                            <div
                              className={
                                transmission.message
                                  ? 'mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700'
                                  : ''
                              }
                            >
                              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                Additional Info
                              </p>
                              <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                                {transmission.additionalInfo}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800/30 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        {(transmission.status === 'NEW' || transmission.status === 'ARCHIVED') && (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => updateStatus(transmission.id, 'READ')}
                            className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-xs font-medium">Mark Read</span>
                          </motion.button>
                        )}
                        {transmission.status === 'READ' && (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => updateStatus(transmission.id, 'ARCHIVED')}
                            className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-neutral-600 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-xs font-medium">Archive</span>
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => deleteTransmission(transmission.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-xs font-medium">Delete</span>
                        </motion.button>
                      </div>
                    </div>
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
