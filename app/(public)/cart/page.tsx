'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCartSelector } from '@/app/lib/store/store'
import OrderSummary from '@/app/components/cart/OrderSummary'
import CartItem from './CartItem'

export default function CartPage() {
  const { items } = useCartSelector()

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Your Cart</h1>
            <p className="text-zinc-400 mb-8">Your cart is empty. Browse events to get started.</p>
            <Link
              href="/events"
              className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Events
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Your Cart</h1>
          <p className="text-zinc-400">{items.length} item(s) in cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <CartItem key={index} index={index} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
