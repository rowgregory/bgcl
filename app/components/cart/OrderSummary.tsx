import { useCartSelector } from '@/app/lib/store/store'
import { motion } from 'framer-motion'
import Link from 'next/link'

const OrderSummary = () => {
  const { items } = useCartSelector()
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="h-fit sticky top-4"
    >
      <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={`${item.eventId}-${item.ticketId}`} className="flex justify-between text-sm">
              <span className="text-zinc-400">
                {item.ticketName} x{item.quantity}
              </span>
              <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-zinc-700/50 mb-4" />

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-white">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Processing Fee</span>
            <span className="text-white">${(totalPrice * 0.029 + 0.3).toFixed(2)}</span>
          </div>
        </div>

        <div className="h-px bg-zinc-700/50 mb-6" />

        <div className="flex justify-between mb-6 bg-sky-600/10 border border-sky-600/30 rounded-lg p-4">
          <span className="font-semibold text-white">Total</span>
          <span className="text-xl font-bold text-sky-400">${(totalPrice + totalPrice * 0.029 + 0.3).toFixed(2)}</span>
        </div>

        <Link
          href="/checkout"
          className="block w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
          Proceed to Checkout
        </Link>

        <Link
          href="/events"
          className="block w-full mt-3 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </motion.div>
  )
}

export default OrderSummary
