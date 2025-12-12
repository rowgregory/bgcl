import { FC } from 'react'
import { motion } from 'framer-motion'
import { Ticket } from '@prisma/client'
import { Inputs } from '@/app/redux/features/formSlice'

export interface EventTicketListProps {
  onSelectTicket: (ticket: Ticket) => void
  tickets: Ticket[]
  inputs: Inputs
}

const EventTicketList: FC<EventTicketListProps> = ({ tickets, onSelectTicket, inputs }) => {
  return (
    <div className="w-80 bg-neutral-800 border-r border-neutral-700 overflow-y-auto">
      <div className="p-6">
        <h3 className="text-white font-semibold text-sm mb-2">Event Tickets</h3>
        <p className="text-neutral-400 text-xs mb-6">Create tickets for your event</p>

        <div className="space-y-3">
          {tickets.map((ticket) => {
            const isSelected = inputs?.id === ticket.id

            return (
              <motion.button
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg transition-all text-left group relative ${
                  isSelected
                    ? 'bg-indigo-500/20 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'bg-neutral-900 border border-neutral-700 hover:border-indigo-500 hover:bg-neutral-900/80'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                )}
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-medium mb-1 transition-colors ${
                        isSelected ? 'text-indigo-300' : 'text-white group-hover:text-indigo-400'
                      }`}
                    >
                      {ticket.name}
                    </h4>
                    <p className={`text-xs line-clamp-2 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
        <div className="mt-6 p-4 bg-neutral-900/50 border border-neutral-700 rounded-lg">
          <p className="text-neutral-400 text-xs">
            💡 <span className="font-medium">Tip:</span> Click a ticket to edit it!
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventTicketList
