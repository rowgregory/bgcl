'use client'

import { setCloseTicketSelectionDrawer } from '@/app/lib/store/slices/ticketSlice'
import { useAppDispatch, useEventSelector, useTicketSelector } from '@/app/lib/store/store'
import { AnimatePresence } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import { addToCart } from '@/app/lib/store/slices/cartSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'

export function TicketSelectionDrawer() {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useAppDispatch()
  const { ticket, ticketSelectionDrawer } = useTicketSelector()
  const { selectedEventId } = useEventSelector()

  const totalPrice = ticket?.price * quantity
  const maxAvailable = ticket?.totalQuantity - ticket?.quantitySold
  const canIncrease = quantity < maxAvailable

  const onClose = () => dispatch(setCloseTicketSelectionDrawer())

  const handleAddToCart = () => {
    dispatch(addToCart({ ticket, quantity, eventId: selectedEventId }))
    onClose()

    dispatch(
      showToast({
        type: 'success',
        message: 'Added to Cart',
        description: `${quantity}x ${ticket.name} added to your cart`
      })
    )
  }

  return (
    <AnimatePresence>
      {ticketSelectionDrawer && (
        <>
          {/* Backdrop */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">Select Quantity</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Ticket Info */}
              <div>
                <h3 className="text-lg font-semibold text-white">{ticket?.name}</h3>
                {ticket?.description && <p className="text-sm text-zinc-400 mt-2">{ticket?.description}</p>}
                <p className="text-2xl font-bold text-sky-400 mt-3">${(ticket?.price).toFixed(2)}</p>
              </div>

              {/* Availability */}
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <p className="text-sm text-zinc-400">
                  {maxAvailable} ticket{maxAvailable !== 1 ? 's' : ''} remaining
                </p>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5 text-zinc-400" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxAvailable}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (!isNaN(val)) {
                        setQuantity(Math.max(1, Math.min(val, maxAvailable)))
                      }
                    }}
                    className="w-16 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:border-sky-600"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!canIncrease}
                    className="p-2 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-sky-900/20 border border-sky-700/50 rounded-lg">
                <p className="text-sm text-zinc-400">Total Price</p>
                <p className="text-3xl font-bold text-sky-400 mt-1">${totalPrice.toFixed(2)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-700 p-6 space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
