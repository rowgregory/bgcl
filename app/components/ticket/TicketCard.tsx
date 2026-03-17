'use client'

import { hydrateTicket, setOpenTicketSelectionDrawer } from '@/app/lib/store/slices/ticketSlice'
import { store } from '@/app/lib/store/store'
import { setSelectedEvent } from '@/app/lib/store/slices/eventSlice'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { setRedirectCookie } from '@/app/lib/actions/setRedirectCookie'
import { ITicket } from '@/types/entities/ticket'
import { FC } from 'react'

function getTicketStatus(ticket: ITicket): {
  available: boolean
  message: string
} {
  if (!ticket.isAvailable) {
    return { available: false, message: 'Not available' }
  }

  if (ticket.quantitySold >= ticket.totalQuantity) {
    return { available: false, message: 'Sold out' }
  }

  return { available: true, message: 'Available' }
}

export const TicketCard: FC<{ ticket: ITicket }> = ({ ticket }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { available, message } = getTicketStatus(ticket)

  const handleTicketSelect = (ticket) => {
    store.dispatch(hydrateTicket(ticket))
    store.dispatch(setSelectedEvent(ticket.eventId))
    store.dispatch(setOpenTicketSelectionDrawer())
  }

  return (
    <div
      className={`p-5 sm:p-6 rounded-xl border transition-all flex flex-col justify-between ${
        available
          ? 'dark:bg-neutral-800/50 dark:border-neutral-700 dark:hover:border-sky-500 dark:hover:shadow-sky-500/20 bg-white border-neutral-200 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10'
          : 'dark:bg-neutral-900/30 dark:border-neutral-800/50 bg-neutral-50/80 border-neutral-100 cursor-not-allowed'
      }`}
      aria-label={`${ticket.name} — ${available ? `$${ticket.price}` : message}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900 truncate">
            {ticket.name}
          </h3>
          {!available && (
            <span
              className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                message === 'Sold out'
                  ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'
              }`}
            >
              {message}
            </span>
          )}
        </div>
        {ticket.description && (
          <p
            className={`text-xs sm:text-sm mt-1 leading-relaxed ${available ? 'dark:text-neutral-400 text-neutral-500' : 'dark:text-neutral-600 text-neutral-400'}`}
          >
            {ticket.description}
          </p>
        )}
      </div>

      <div>
        <p
          className={`text-xl sm:text-2xl font-bold mt-3 ${available ? 'dark:text-sky-400 text-sky-600' : 'dark:text-neutral-600 text-neutral-400'}`}
        >
          ${ticket.price}
        </p>

        {/* Availability + sold count */}
        <div className="mt-2 flex items-center justify-between">
          {available ? (
            <p
              className="dark:text-emerald-400 text-emerald-600 font-medium flex items-center gap-1 text-sm"
              role="status"
            >
              <span aria-hidden="true">✓</span> Available
            </p>
          ) : (
            <p className="text-xs dark:text-neutral-600 text-neutral-400" role="status">
              {message}
            </p>
          )}
          <p className="text-xs dark:text-neutral-500 text-neutral-400 tabular-nums">
            {ticket.quantitySold} / {ticket.totalQuantity} sold
          </p>
        </div>

        {available && (
          <p className="dark:text-neutral-500 text-neutral-400 text-xs mt-0.5">
            {ticket.totalQuantity - ticket.quantitySold} remaining
          </p>
        )}

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
                ? 'bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white focus-visible:ring-sky-500 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-offset-white cursor-pointer'
                : 'dark:bg-neutral-800/50 dark:text-neutral-600 bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {!session ? 'Sign In to Purchase' : available ? 'Select Ticket' : message}
        </button>
      </div>
    </div>
  )
}
