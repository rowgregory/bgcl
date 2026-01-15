'use client'

import { FC } from 'react'
import { Ticket } from '@prisma/client'
import { hydrateTicket, setOpenTicketSelectionDrawer } from '@/app/lib/store/slices/ticketSlice'
import { useAppDispatch } from '@/app/lib/store/store'
import { setSelectedEvent } from '@/app/lib/store/slices/eventSlice'
import { getTicketStatus } from '@/app/lib/utils/event-utils'

interface ITicketCard {
  ticket: Ticket
}

const TicketCard: FC<ITicketCard> = ({ ticket }) => {
  const { available, message } = getTicketStatus(ticket)
  const dispatch = useAppDispatch()

  const handleTicketSelect = (ticket: Ticket) => {
    dispatch(hydrateTicket(ticket))
    dispatch(setSelectedEvent(ticket.eventId))
    dispatch(setOpenTicketSelectionDrawer())
  }

  return (
    <>
      <div
        className={`
      p-6 rounded-lg border transition-all
      ${
        available
          ? 'bg-zinc-800/50 border-zinc-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer'
          : 'bg-zinc-900/50 border-zinc-700 opacity-60 cursor-not-allowed'
      }
    `}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{ticket.name}</h3>
            {ticket.description && <p className="text-sm text-zinc-400 mt-1">{ticket.description}</p>}
            <p className="text-2xl font-bold text-cyan-400 mt-3">${ticket.price}</p>

            {/* Availability info */}
            <div className="mt-3 text-sm">
              {!available ? (
                <div className="flex items-center gap-2">
                  {message === 'Sold out' && (
                    <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-full font-medium border border-red-700/50">
                      Sold Out
                    </span>
                  )}
                  {message === 'Sales ended' && (
                    <span className="px-2 py-1 bg-zinc-700/50 text-zinc-400 rounded-full font-medium border border-zinc-600/50">
                      Sales Ended
                    </span>
                  )}
                  {message === 'Not available' && (
                    <span className="px-2 py-1 bg-zinc-700/50 text-zinc-400 rounded-full font-medium border border-zinc-600/50">
                      Not Available
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-emerald-400 font-medium">✓ Available</span>
              )}

              {/* Show remaining quantity */}
              {available && (
                <p className="text-zinc-500 mt-1">{ticket.totalQuantity - ticket.quantitySold} remaining</p>
              )}
            </div>
          </div>
        </div>

        {/* Purchase button */}
        <button
          disabled={!available}
          onClick={() => available && handleTicketSelect(ticket)}
          className={`
          w-full mt-4 py-3 rounded-lg font-medium transition-all
          ${
            available
              ? 'bg-cyan-600 text-white hover:bg-cyan-700 active:scale-[0.98]'
              : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
          }
        `}
        >
          {available ? 'Select Ticket' : message}
        </button>
      </div>
    </>
  )
}

export default TicketCard
