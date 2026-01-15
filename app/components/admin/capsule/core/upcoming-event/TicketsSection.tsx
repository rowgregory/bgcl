import { EditTicketPayload } from '@/types/entities/ticket'
import { FC } from 'react'
import { motion } from 'framer-motion'

interface ViewMoreTicketsButtonProps {
  count: number
}

interface ITicketCard {
  ticket: EditTicketPayload
  onClick: (e: any) => void
}

interface ITicketSection {
  tickets: EditTicketPayload[]
  moreCount: number
  onEditTicket: (e: any, ticket: EditTicketPayload) => void
  index: number
}

const ViewMoreTicketsButton: FC<ViewMoreTicketsButtonProps> = ({ count }) => (
  <button className="w-full text-xs text-zinc-400 hover:text-purple-400 py-1 transition-colors">
    +{count} more ticket{count !== 1 ? 's' : ''}
  </button>
)

// TicketCard.tsx
const TicketCard: FC<ITicketCard> = ({ ticket, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-2 bg-zinc-700/30 rounded-lg border border-zinc-700/50 cursor-pointer transition-all hover:bg-zinc-700/50 hover:border-zinc-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
  >
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
        {ticket.name}
      </p>
      <p className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
        {ticket.quantitySold} / {ticket.totalQuantity} sold
      </p>
    </div>
    <div className="text-right ml-3">
      <p className="text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
        ${ticket.price.toFixed(2)}
      </p>
      {!ticket.isAvailable && <p className="text-xs text-red-400">Unavailable</p>}
    </div>
  </div>
)

export const TicketsSection: FC<ITicketSection> = ({ tickets, moreCount, onEditTicket, index }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    transition={{ delay: 0.6 + index * 0.1 }}
    className="pt-3 border-t border-zinc-700/50"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-zinc-400 uppercase">Available Tickets</span>
      <span className="text-xs text-zinc-500">
        {tickets.length} type{tickets.length !== 1 ? 's' : ''}
      </span>
    </div>
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} onClick={(e) => onEditTicket(e, ticket)} />
      ))}
      {moreCount > 0 && <ViewMoreTicketsButton count={moreCount} />}
    </div>
  </motion.div>
)
