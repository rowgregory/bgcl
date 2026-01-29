'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCartSelector } from '@/app/lib/store/store'
import { CheckoutForm } from '@/app/components/forms/CheckoutForm'
import Picture from '@/app/components/common/Picture'

export default function CheckoutPage() {
  const { items } = useCartSelector()

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Checkout</h1>
            <p className="text-zinc-400 mb-8">Your cart is empty.</p>
            <Link
              href="/events"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = totalPrice * 0.029 + 0.3
  const finalTotal = totalPrice + processingFee

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Form (Black) */}
        <div className="bg-black border-r border-zinc-800 flex justify-end">
          <div className="max-w-2xl w-full px-4 py-12 lg:px-12 h-full flex flex-col">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              {/* Logo */}
              <div className="mb-8">
                <Picture src="/images/logo-1.webp" alt="Boys & Girls Club of Lynn" className="h-8 w-auto" priority />
              </div>

              <Link
                href="/cart"
                className="inline-flex items-center space-x-2 text-sky-400 hover:text-sky-300 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Cart</span>
              </Link>
              <h1 className="text-5xl font-bold text-white">Checkout</h1>
            </motion.div>
            {/* Checkout Form */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <CheckoutForm />
            </motion.div>
          </div>
        </div>

        {/* Right Side - Order Summary (Zinc) */}
        <div className="bg-zinc-950 border-l border-zinc-800">
          <div className="max-w-2xl px-4 py-12 lg:px-12 h-full flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-12"
            >
              {/* Items */}
              <div className="space-y-6 pb-8 border-b border-zinc-800">
                {items.map((item) => (
                  <div key={`${item.eventId}-${item.ticketId}`} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white font-medium text-base">{item.ticketName}</p>
                      <p className="text-zinc-500 text-sm mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-white font-medium text-base">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 py-8">
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-sm">Subtotal</span>
                  <span className="text-white font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-sm">Processing Fee</span>
                  <span className="text-white font-medium">${processingFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-zinc-800 pt-6">
                <div className="flex justify-between items-end">
                  <span className="text-zinc-300 text-sm font-medium">Total</span>
                  <span className="text-4xl font-bold text-white">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
