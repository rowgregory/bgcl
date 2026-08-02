import { formatCurrency } from '@/lib/utils/currency.utils'
import { formatDate } from '@/lib/utils/date-utils'
import { IOrder } from '@/types/entities/order'
import { motion } from 'framer-motion'
import { Ticket } from 'lucide-react'
import { StatusBadge } from '@/app/(authenticated)/admin/_components/StatusBadge'

export const TicketOrderRow = ({
  order,
  index,
  onOpen,
  setOrder
}: {
  order: IOrder
  index: number
  onOpen: (open: boolean) => void
  setOrder: (order) => void
}) => {
  const totalQuantity = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  const eventName = order.orderItems?.[0]?.ticket?.event?.title ?? '—'

  return (
    <motion.tr
      onClick={() => {
        setOrder(order)
        onOpen(true)
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group cursor-pointer"
    >
      {/* Amount */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm font-black dark:text-white text-neutral-900 tabular-nums">
          {formatCurrency(order.totalAmount)}
        </span>
      </td>

      {/* Customer name */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm font-semibold dark:text-neutral-200 text-neutral-800">{order.customerName}</span>
      </td>

      {/* Customer email */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs dark:text-neutral-400 text-neutral-600 font-mono">{order.customerEmail}</span>
      </td>

      {/* Event */}
      <td className="px-4 py-3 whitespace-nowrap max-w-40">
        <span className="text-xs font-semibold dark:text-sky-400 text-sky-600 truncate block">{eventName}</span>
      </td>

      {/* Quantity */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="inline-flex items-center gap-1 text-xs font-semibold dark:text-neutral-400 text-neutral-600">
          <Ticket className="w-3 h-3" aria-hidden="true" />
          {totalQuantity}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <time
          dateTime={new Date(order.createdAt).toISOString()}
          className="text-xs dark:text-neutral-500 text-neutral-500"
        >
          {formatDate(order.createdAt)}
        </time>
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
    </motion.tr>
  )
}
