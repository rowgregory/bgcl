import { formatDate } from '@/lib/utils/date-utils'
import { motion } from 'framer-motion'
import { CheckCircle2, Users, XCircle } from 'lucide-react'
import { EventGroup } from '../_types/event-manifest.types'

export function AttendeeRow({ attendee, index }: { attendee: EventGroup['attendees'][number]; index: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
      className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
    >
      {/* Name */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div className="shrink-0 w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center" aria-hidden="true">
            <span className="text-white text-xs font-bold leading-none">
              {attendee.name?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
          <span className="text-sm font-semibold dark:text-neutral-200 text-neutral-800">{attendee.name}</span>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs font-mono dark:text-neutral-400 text-neutral-600">{attendee.email}</span>
      </td>

      {/* Purchased */}
      <td className="px-4 py-3 whitespace-nowrap">
        <time
          dateTime={new Date(attendee.purchasedAt).toISOString()}
          className="text-xs dark:text-neutral-500 text-neutral-500"
        >
          {formatDate(attendee.purchasedAt)}
        </time>
      </td>

      {/* Tickets */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="inline-flex items-center gap-1 text-xs font-semibold dark:text-sky-400 text-sky-600 dark:bg-sky-500/10 bg-sky-50 px-2 py-0.5 rounded-full">
          {attendee.totalTickets} ticket{attendee.totalTickets !== 1 ? 's' : ''}
        </span>
      </td>

      {/* Guests */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="inline-flex items-center gap-1 text-xs font-semibold dark:text-neutral-400 text-neutral-600 dark:bg-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-full">
          <Users className="w-3 h-3" aria-hidden="true" />
          {attendee.guestCount ?? 0}
        </span>
      </td>

      {/* Attending */}
      <td className="px-4 py-3 whitespace-nowrap">
        {attendee.attendingEvent ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/10 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
            Attending
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 dark:bg-amber-500/10 bg-amber-50 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" aria-hidden="true" />
            Not attending
          </span>
        )}
      </td>
    </motion.tr>
  )
}
