import { formatCurrency } from '@/lib/utils/currency.utils'
import { formatDate } from '@/lib/utils/date-utils'
import { motion } from 'framer-motion'

type OrderItem = {
  id: string
  ticketName: string
  quantity: number
  pricePerUnit: number
  totalPrice: number
  raffleTicketNumber?: number | string | null
  raffleTicketCode?: string | null
}

export const TicketsGrid = ({ order }: { order: any }) => {
  const items: OrderItem[] = order?.orderItems ?? []

  if (items.length === 0) return null

  const event = order?.event
  const showRaffleNumbers = Boolean(event?.showRaffleNumbers)

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-4 mb-8 border-t border-neutral-200 dark:border-neutral-800"
    >
      <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">Tickets</h2>

      <ul role="list" className="divide-y divide-neutral-100 dark:divide-neutral-900 list-none p-0 m-0">
        {items.map((item) => (
          <li key={item.id} className="py-3 flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-neutral-900 dark:text-white truncate">{item.ticketName}</p>

              <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                {item.quantity} × {formatCurrency(item.pricePerUnit)}
                {event?.date && ` · ${formatDate(event.date)}`}
              </p>

              {showRaffleNumbers && item.raffleTicketNumber && (
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                  No. {String(item.raffleTicketNumber).padStart(4, '0')}
                  {item.raffleTicketCode && ` · ${item.raffleTicketCode}`}
                </p>
              )}
            </div>

            <p className="text-sm text-neutral-900 dark:text-white shrink-0 tabular-nums">{formatCurrency(item.totalPrice)}</p>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}
