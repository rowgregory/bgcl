'use client'

import { hydrateTicket, setOpenTicketSelectionDrawer } from '@/app/lib/store/slices/ticketSlice'
import { store } from '@/app/lib/store/store'
import { setSelectedEvent } from '@/app/lib/store/slices/eventSlice'
import { getTicketStatus } from '@/app/lib/utils/event-utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { setRedirectCookie } from '@/app/lib/actions/setRedirectCookie'
import { Ticket } from '@/types/entities/ticket'

export const TicketCard = ({ ticket }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { available, message } = getTicketStatus(ticket)

  const handleTicketSelect = (ticket: Ticket) => {
    store.dispatch(hydrateTicket(ticket))
    store.dispatch(setSelectedEvent(ticket.eventId))
    store.dispatch(setOpenTicketSelectionDrawer())
  }

  return (
    <div
      className={`p-5 sm:p-6 rounded-xl border transition-all flex flex-col justify-between ${
        available
          ? 'dark:bg-neutral-800/50 dark:border-neutral-700 dark:hover:border-sky-500 dark:hover:shadow-sky-500/20 bg-white border-neutral-200 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 cursor-pointer'
          : 'dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 opacity-60 cursor-not-allowed'
      }`}
      aria-label={`${ticket.name} — ${available ? `$${ticket.price}` : message}`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900 truncate">{ticket.name}</h3>
        {ticket.description && (
          <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-500 mt-1 leading-relaxed">
            {ticket.description}
          </p>
        )}
      </div>

      <div>
        <p className="text-xl sm:text-2xl font-bold dark:text-sky-400 text-sky-600 mt-3">${ticket.price}</p>

        {/* Availability */}
        <div className="mt-3 text-sm">
          {!available ? (
            <div className="flex items-center gap-2" role="status">
              {message === 'Sold out' && (
                <span className="px-2 py-1 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50 bg-red-50 text-red-600 border-red-200 rounded-full text-xs font-medium border">
                  Sold Out
                </span>
              )}
              {message === 'Sales ended' && (
                <span className="px-2 py-1 dark:bg-neutral-700/50 dark:text-neutral-400 dark:border-neutral-600/50 bg-neutral-100 text-neutral-500 border-neutral-300 rounded-full text-xs font-medium border">
                  Sales Ended
                </span>
              )}
              {message === 'Not available' && (
                <span className="px-2 py-1 dark:bg-neutral-700/50 dark:text-neutral-400 dark:border-neutral-600/50 bg-neutral-100 text-neutral-500 border-neutral-300 rounded-full text-xs font-medium border">
                  Not Available
                </span>
              )}
            </div>
          ) : (
            <p className="dark:text-emerald-400 text-emerald-600 font-medium flex items-center gap-1" role="status">
              <span aria-hidden="true">✓</span> Available
            </p>
          )}

          {available && (
            <p className="dark:text-neutral-500 text-neutral-400 text-xs mt-1">
              {ticket.totalQuantity - ticket.quantitySold} remaining
            </p>
          )}
        </div>

        {/* Purchase button */}
        <button
          disabled={!available && !!session}
          onClick={async () => {
            if (!session) {
              await setRedirectCookie(`/events/${ticket.eventId}`)
              router.push('/auth/login')
            } else if (available) {
              handleTicketSelect(ticket)
            }
          }}
          aria-label={
            !session
              ? `Sign in to purchase: ${ticket.name}`
              : available
                ? `Select ticket: ${ticket.name}`
                : `${ticket.name} — ${message}`
          }
          className={`w-full mt-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            !session
              ? 'bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white focus-visible:ring-sky-500 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-offset-white'
              : available
                ? 'bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white focus-visible:ring-sky-500 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-offset-white'
                : 'dark:bg-neutral-700 dark:text-neutral-500 bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {!session ? 'Sign In to Purchase' : available ? 'Select Ticket' : message}
        </button>
      </div>
    </div>
  )
}
