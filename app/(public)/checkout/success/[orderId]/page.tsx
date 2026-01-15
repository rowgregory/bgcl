'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Download, Home, Mail } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage({ order }) {
  const processingFee = order?.totalAmount * 0.029 + 0.3
  const subtotal = order?.totalAmount - processingFee

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 text-lg"
          >
            Thank you for your purchase. Your tickets have been sent to your email.
          </motion.p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-lg overflow-hidden mb-8"
        >
          {/* Order Info Header */}
          <div className="bg-sky-600/10 border-b border-zinc-700/50 px-8 py-6">
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Order Number</p>
              <p className="text-2xl font-bold text-white font-mono">{order?.id}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-8 py-6 border-b border-zinc-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Tickets</h2>
            <div className="space-y-3">
              {order?.orderItems.map(
                (
                  item: {
                    ticketName: string
                    quantity: number
                    totalPrice: number
                  },
                  index: number
                ) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex justify-between items-center p-3 bg-zinc-700/20 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{item.ticketName}</p>
                      <p className="text-sm text-zinc-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-white font-semibold">${(item.totalPrice * item.quantity).toFixed(2)}</p>
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="px-8 py-6 border-b border-zinc-700/50">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Processing Fee</span>
                <span className="text-white">${processingFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="px-8 py-6 bg-sky-600/10">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Total Paid</span>
              <span className="text-3xl font-bold text-sky-400">${order?.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Confirmation Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-lg p-8 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Confirmation Details</h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-sky-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm text-zinc-400">Confirmation Email Sent</p>
                <p className="text-white font-medium">{order?.customerEmail}</p>
              </div>
            </div>

            <div className="h-px bg-zinc-700/50" />

            <div>
              <p className="text-sm text-zinc-400 mb-2">What's Next?</p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start space-x-2">
                  <span className="text-sky-400 mt-1">•</span>
                  <span>Check your email for ticket details and QR codes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sky-400 mt-1">•</span>
                  <span>Arrive 15 minutes early with your ticket QR code</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sky-400 mt-1">•</span>
                  <span>Questions? Check your confirmation email for support contact</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={() => window.print()}
            className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>

          <Link
            href="/events"
            className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
