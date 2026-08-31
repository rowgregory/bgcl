import { EventStatus, TicketType } from '@prisma/client'

export const STATUS_CONFIG: Record<EventStatus, { label: string; color: string; dot: string }> = {
  UPCOMING: { label: 'Upcoming', color: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-500' },
  ONGOING: { label: 'Ongoing', color: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  COMPLETED: { label: 'Completed', color: 'text-neutral-500', dot: 'bg-neutral-400' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  POSTPONED: { label: 'Postponed', color: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
  ARCHIVED: { label: 'Archived', color: 'text-neutral-400', dot: 'bg-neutral-300' }
}

export const TICKET_TYPE_CONFIG: Record<TicketType, { label: string; color: string }> = {
  // Admits guests
  GENERAL: { label: 'General', color: 'text-sky-600 dark:text-sky-400' },
  TABLE: { label: 'Table', color: 'text-sky-600 dark:text-sky-400' },
  SPONSORSHIP: { label: 'Sponsorship', color: 'text-sky-600 dark:text-sky-400' },

  // Bought alongside a seat, admits nobody on its own
  RAFFLE: { label: 'Raffle', color: 'text-amber-600 dark:text-amber-400' },
  TOURNAMENT: { label: 'Tournament', color: 'text-amber-600 dark:text-amber-400' },

  // Support only
  AD: { label: 'Ad', color: 'text-emerald-600 dark:text-emerald-400' }
}
