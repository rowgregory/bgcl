import { formatDate } from '@/app/lib/utils/date-utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Archive, CheckCircle, Heart, MessageSquare, Phone, Trash2, X } from 'lucide-react'
import { deleteContactSubmission } from '@/app/lib/actions/contact-submission/deleteContactSubmission'
import { updateContactSubmissionStatus } from '@/app/lib/actions/contact-submission/updateContactSubmissionStatus'
import { store, useUiSelector } from '@/app/lib/store/store'
import { setCloseContactSubmissionDrawer } from '@/app/lib/store/slices/uiSlice'
import { useRouter } from 'next/navigation'

export function ContactSubmissionDrawer() {
  const { contactSubmissionDrawer, contactSubmission } = useUiSelector()
  const onClose = () => store.dispatch(setCloseContactSubmissionDrawer())
  const router = useRouter()

  return (
    <AnimatePresence>
      {contactSubmissionDrawer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full sm:w-120 z-50 bg-white dark:bg-neutral-900 shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Transmission details"
          >
            {/* Drawer header */}
            <div
              className={`px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 ${
                contactSubmission?.type === 'VOLUNTEER'
                  ? 'bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30'
                  : 'bg-linear-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${contactSubmission?.type === 'VOLUNTEER' ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-sky-100 dark:bg-sky-900/50'}`}
                  >
                    {contactSubmission?.type === 'VOLUNTEER' ? (
                      <Heart
                        className={`w-4 h-4 ${contactSubmission?.type === 'VOLUNTEER' ? 'text-indigo-600 dark:text-indigo-400' : 'text-sky-600 dark:text-sky-400'}`}
                      />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold dark:text-white text-neutral-900">
                      {contactSubmission?.type === 'VOLUNTEER'
                        ? 'Volunteer Application'
                        : `Subject: ${contactSubmission?.subject}`}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDate(contactSubmission?.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <X className="w-4 h-4 dark:text-neutral-400 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Contact info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    {contactSubmission?.firstName?.[0]}
                    {contactSubmission?.lastName?.[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {contactSubmission?.firstName} {contactSubmission?.lastName}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{contactSubmission?.email}</p>
                </div>
              </div>

              {contactSubmission?.phone && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{contactSubmission?.phone}</span>
                </div>
              )}

              {/* Volunteer details */}
              {contactSubmission?.type === 'VOLUNTEER' && (
                <div className="grid grid-cols-2 gap-2">
                  {contactSubmission?.programInterests && (
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Program</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                        {contactSubmission?.programInterests.replace('-', ' ')}
                      </p>
                    </div>
                  )}
                  {contactSubmission?.availabilityDays && (
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Days</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {contactSubmission?.availabilityDays}
                      </p>
                    </div>
                  )}
                  {contactSubmission?.availabilityHours && (
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Hours</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                        {contactSubmission?.availabilityHours}
                      </p>
                    </div>
                  )}
                  {contactSubmission?.yearsExperience && (
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Experience</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {contactSubmission?.yearsExperience} years
                      </p>
                    </div>
                  )}
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg col-span-2">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Background Check</p>
                    <p
                      className={`text-sm font-medium flex items-center gap-1.5 mt-0.5 ${contactSubmission?.backgroundCheckAck ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                      {contactSubmission?.backgroundCheckAck ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Acknowledged
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Not Acknowledged
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Message */}
              {(contactSubmission?.message || contactSubmission?.additionalInfo) && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl space-y-3">
                  {contactSubmission?.message && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                      {contactSubmission?.message}
                    </p>
                  )}
                  {contactSubmission?.additionalInfo && (
                    <div
                      className={
                        contactSubmission?.message ? 'pt-3 border-t border-neutral-200 dark:border-neutral-700' : ''
                      }
                    >
                      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Additional Info</p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                        {contactSubmission?.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30">
              <div className="flex items-center gap-2">
                {(contactSubmission?.status === 'NEW' || contactSubmission?.status === 'ARCHIVED') && (
                  <button
                    onClick={() => {
                      updateContactSubmissionStatus(contactSubmission?.id, 'READ')
                      router.refresh()
                      onClose()
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 rounded-lg transition-colors text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Mark Read
                  </button>
                )}
                {contactSubmission?.status === 'READ' && (
                  <button
                    onClick={() => {
                      updateContactSubmissionStatus(contactSubmission?.id, 'ARCHIVED')
                      router.refresh()
                      onClose()
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-neutral-600 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg transition-colors text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                  >
                    <Archive className="w-3.5 h-3.5" aria-hidden="true" />
                    Archive
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteContactSubmission(contactSubmission?.id)
                    router.refresh()
                    onClose()
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
