import { FC } from 'react'
import { motion } from 'framer-motion'
import { Ticket } from '@prisma/client'

export interface EventTicketListProps {
  onSelectTicket: (ticket: Ticket) => void
  tickets: Ticket[]
}

const EventTicketList: FC<EventTicketListProps> = ({ tickets, onSelectTicket }) => {
  return (
    <div className="w-80 bg-neutral-800 border-r border-neutral-700 overflow-y-auto">
      <div className="p-6">
        <h3 className="text-white font-semibold text-sm mb-2">Event Tickets</h3>
        <p className="text-neutral-400 text-xs mb-6">Create tickets for your event</p>

        <div className="space-y-3">
          {tickets.map((ticket) => (
            <motion.button
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-lg hover:border-indigo-500 hover:bg-neutral-900/80 transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium mb-1 group-hover:text-indigo-400 transition-colors">
                    {ticket.name}
                  </h4>
                  <p className="text-neutral-500 text-xs line-clamp-2">{ticket.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
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
