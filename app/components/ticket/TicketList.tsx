import { FC } from 'react'
import { motion } from 'framer-motion'
import { Ticket } from '@prisma/client'
import { Inputs } from '@/app/lib/store/slices/formSlice'

export interface TicketListProps {
  onSelectTicket: (ticket: Ticket & { isUpdating: boolean }) => void
  tickets: Ticket[]
  inputs: Inputs
}

export const TicketList: FC<TicketListProps> = ({ tickets, onSelectTicket, inputs }) => {
  return (
    <div className="max-w-80 w-full bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto">
      <div className="p-6">
        <h3 className="text-neutral-900 dark:text-white font-semibold text-sm mb-2">Created Tickets</h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-6">Create tickets for your event</p>

        <div className="space-y-3">
          {tickets.map((ticket) => {
            const isSelected = inputs?.id === ticket.id

            return (
              <motion.button
                key={ticket.id}
                onClick={() => onSelectTicket({ ...ticket, isUpdating: true })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg transition-all text-left group relative ${
                  isSelected
                    ? 'bg-sky-500/20 border-2 border-sky-500 shadow-lg shadow-sky-500/20'
                    : 'bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-sky-500 dark:hover:border-sky-500 hover:bg-neutral-100 dark:hover:bg-neutral-900/80'
                }`}
              >
                {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full animate-pulse" />}
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-medium mb-1 transition-colors ${
                        isSelected
                          ? 'text-sky-600 dark:text-sky-300'
                          : 'text-neutral-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400'
                      }`}
                    >
                      {ticket.name}
                    </h4>
                    <p
                      className={`text-xs line-clamp-2 ${isSelected ? 'text-neutral-600 dark:text-neutral-300' : 'text-neutral-500 dark:text-neutral-500'}`}
                    >
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <p className="text-neutral-500 dark:text-neutral-400 text-xs">
            💡 <span className="font-medium">Tip:</span> Click a ticket to edit it!
          </p>
        </div>
      </div>
    </div>
  )
}
