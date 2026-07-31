import { removeFromCart, updateQuantity } from '@/lib/store/slices/cartSlice'
import { store } from '@/lib/store/store'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { FC } from 'react'

const CartItem: FC<{ item: any; index: number }> = ({ item, index }) => {
  return (
    <motion.div
      key={`${item.eventId}-${item.ticketId}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-lg overflow-hidden hover:border-zinc-600 transition-all"
    >
      <div className="p-6">
        {/* Event and Ticket Info */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className="text-sm text-sky-400 font-medium mb-1">{item.ticketName}</p>
            <span className="text-xs text-zinc-500">Event ID: {item.eventId}</span>
          </div>
          <button
            onClick={() => store.dispatch(removeFromCart(item.ticketId))}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
            aria-label="Remove from cart"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-700/50 my-4" />

        {/* Quantity and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-zinc-400">Quantity:</span>
            <div className="flex items-center border border-zinc-700 rounded-lg">
              <button
                onClick={() =>
                  store.dispatch(updateQuantity({ ticketId: item.ticketId, quantity: Math.max(1, item.quantity - 1) }))
                }
                className="p-2 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-white font-medium min-w-12 text-center">{item.quantity}</span>
              <button
                onClick={() => store.dispatch(updateQuantity({ ticketId: item.ticketId, quantity: item.quantity + 1 }))}
                className="p-2 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400 mb-1">Subtotal</p>
            <p className="text-xl font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem
