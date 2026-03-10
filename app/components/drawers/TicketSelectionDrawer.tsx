'use client'

import { setCloseTicketSelectionDrawer } from '@/app/lib/store/slices/ticketSlice'
import { store, useTicketSelector } from '@/app/lib/store/store'
import { AnimatePresence } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import Backdrop from '../common/Backdrop'
import Drawer from '../common/Drawer'
import { addToCart } from '@/app/lib/store/slices/cartSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'

export function TicketSelectionDrawer() {
  const [quantity, setQuantity] = useState(1)
  const { ticket, ticketSelectionDrawer } = useTicketSelector()

  const totalPrice = ticket?.price * quantity
  const maxAvailable = ticket?.totalQuantity - ticket?.quantitySold
  const canIncrease = quantity < maxAvailable

  const onClose = () => store.dispatch(setCloseTicketSelectionDrawer())

  const handleAddToCart = () => {
    store.dispatch(addToCart({ ticket, quantity, eventId: ticket.eventId, eventTitle: ticket.event.title }))
    onClose()

    store.dispatch(
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
          <Backdrop onClose={onClose} />

          <Drawer>
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900">Select Quantity</h2>
              <button
                onClick={onClose}
                aria-label="Close ticket selection"
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <X className="w-5 h-5 dark:text-neutral-400 text-neutral-500" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Ticket Info */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900">{ticket?.name}</h3>
                {ticket?.description && (
                  <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-500 mt-2 leading-relaxed">
                    {ticket?.description}
                  </p>
                )}
                <p className="text-xl sm:text-2xl font-bold dark:text-sky-400 text-sky-600 mt-3">
                  ${ticket?.price.toFixed(2)}
                </p>
              </div>

              {/* Availability */}
              <div
                role="status"
                aria-live="polite"
                className="p-3 sm:p-4 dark:bg-neutral-800/50 dark:border-neutral-700 bg-neutral-50 border-neutral-200 rounded-lg border"
              >
                <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-500">
                  <span className="font-semibold dark:text-white text-neutral-900">{maxAvailable}</span> ticket
                  {maxAvailable !== 1 ? 's' : ''} remaining
                </p>
              </div>

              {/* Quantity Selector */}
              <div>
                <label
                  htmlFor="ticket-quantity"
                  className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-3"
                >
                  Quantity
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <Minus
                      className="w-4 h-4 sm:w-5 sm:h-5 dark:text-neutral-400 text-neutral-500"
                      aria-hidden="true"
                    />
                  </button>
                  <input
                    id="ticket-quantity"
                    type="number"
                    min={1}
                    max={maxAvailable}
                    value={quantity}
                    aria-label={`Quantity, currently ${quantity}`}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (!isNaN(val)) {
                        setQuantity(Math.max(1, Math.min(val, maxAvailable)))
                      }
                    }}
                    className="w-14 sm:w-16 px-2 sm:px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 text-neutral-900 border rounded-lg text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!canIncrease}
                    aria-label="Increase quantity"
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 dark:text-neutral-400 text-neutral-500" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div
                aria-live="polite"
                aria-label={`Total price: $${totalPrice.toFixed(2)}`}
                className="p-3 sm:p-4 dark:bg-sky-900/20 dark:border-sky-700/50 bg-sky-50 border-sky-200 rounded-lg border"
              >
                <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-500">Total Price</p>
                <p className="text-2xl sm:text-3xl font-bold dark:text-sky-400 text-sky-600 mt-1">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 sm:p-6 space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full px-4 py-2.5 sm:py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm sm:text-base font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-offset-white"
              >
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 sm:py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-sm sm:text-base font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-offset-white"
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
