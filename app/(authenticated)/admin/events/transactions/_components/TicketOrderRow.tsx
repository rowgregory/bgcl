import { formatCurrency } from '@/lib/utils/currency.utils'
import { formatDate } from '@/lib/utils/date-utils'
import { IOrder } from '@/types/entities/order'
import { motion } from 'framer-motion'
import { StatusBadge } from '@/app/(authenticated)/admin/_components/StatusBadge'
import { ChevronRight } from 'lucide-react'

export const TicketOrderRow = ({
  order,
  index,
  onOpen,
  setOrder
}: {
  order: IOrder
  index: number
  onOpen: (open: boolean) => void
  setOrder: (order: IOrder) => void
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
      className="group border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
    >
      {/* Amount */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm text-neutral-900 dark:text-white tabular-nums">{formatCurrency(order.totalAmount)}</span>
      </td>

      {/* Customer */}
      <td className="px-4 py-3 max-w-56">
        <span className="block text-sm text-neutral-900 dark:text-white truncate">{order.customerName}</span>
        <span className="block text-xs text-neutral-400 dark:text-neutral-600 truncate">{order.customerEmail}</span>
      </td>

      {/* Event */}
      <td className="px-4 py-3 max-w-48">
        <span className="block text-sm text-neutral-500 dark:text-neutral-400 truncate">{eventName}</span>
      </td>

      {/* Quantity */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums">{totalQuantity}</span>
      </td>

      {/* Date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <time
          dateTime={new Date(order.createdAt).toISOString()}
          className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums"
        >
          {formatDate(order.createdAt)}
        </time>
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
      {/* Open */}
      <td className="px-4 py-3 w-8">
        <ChevronRight
          className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors"
          aria-hidden="true"
        />
      </td>
    </motion.tr>
  )
}
