import { motion } from 'framer-motion'
import { TicketStub } from './TicketStub'

export const TicketsGrid = ({ order }: { order: any }) => {
  if (!order?.orderItems?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-8 bg-neutral-50 dark:bg-neutral-800/50"
    >
      <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-widest">
        Your Tickets
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {order.orderItems.map((item: any) => (
          <TicketStub
            key={item.id ?? `${item.ticketName}-${item.raffleTicketNumber ?? item.pricePerUnit}`}
            item={item}
            event={order.event}
            orderId={order.id}
            showRaffleNumbers={Boolean(order?.event?.showRaffleTicketNumbers)}
          />
        ))}
      </div>
    </motion.div>
  )
}
