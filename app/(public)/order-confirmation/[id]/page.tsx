'use client'

import Picture from '@/app/components/common/Picture'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'

export default function OrderConfirmationPage({ order }) {
  const isDonation = order?.type?.includes('DONATION')
  const isRecurring = order?.type === 'RECURRING_DONATION'
  const isTicket = order?.type === 'TICKET_PURCHASE'

  return (
    <div className="min-h-screen">
      {/* Compact Header */}
      <div className="border-b border-zinc-800 sticky top-0 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-4 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Picture src="/images/logo-1.webp" alt="Boys & Girls Club of Lynn" className="h-6 w-auto" priority />
          </Link>
          <Link
            href={isDonation ? '/donate' : '/events'}
            className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-16 lg:px-8">
        {/* Success Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {isDonation ? 'Thank You for Your Donation!' : 'Your Tickets Are Confirmed!'}
          </h1>
          <p className="text-zinc-400 text-lg">
            {isDonation
              ? 'Your generous support helps us empower youth in our community.'
              : 'Check your email for ticket details and event information.'}
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-zinc-800 rounded-lg p-8 mb-8"
        >
          {/* Order Type Header */}
          <div className="mb-8 pb-8 border-b border-zinc-800">
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">
              {isDonation ? (isRecurring ? 'Monthly Donation' : 'One-Time Donation') : 'Ticket Purchase'}
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-white">${order?.totalAmount.toFixed(2)}</h2>
              <p className="text-xs text-zinc-500">
                {new Date(order?.paidAt || order?.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Donation Details */}
          {isDonation && (
            <div className="space-y-6 mb-8 pb-8 border-b border-zinc-800">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Donor Name</p>
                <p className="text-white">{order?.customerName}</p>
              </div>

              {isRecurring && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Frequency</p>
                      <p className="text-white capitalize">{order?.recurringFrequency} donation</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Next Billing</p>
                      <p className="text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-400" />
                        {new Date(order.nextBillingDate!).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-400">
                      Your subscription will continue until you cancel. You can manage it anytime in your account
                      settings.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Ticket Details */}
          {isTicket && (
            <div className="space-y-6 mb-8 pb-8 border-b border-zinc-800">
              {order?.event && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Event</p>
                  <p className="text-lg font-semibold text-white mb-1">{order?.event.name}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(order?.event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}{' '}
                    at {order?.event.time}
                  </p>
                </div>
              )}

              {order?.orderItems && order?.orderItems.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-4">Your Tickets</p>
                  <div className="space-y-3">
                    {order?.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start p-3 bg-zinc-900/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.ticketName}</p>
                          <p className="text-sm text-zinc-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-white font-semibold">${item.totalPrice.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Confirmation Number</p>
              <p className="text-white font-mono text-sm break-all">{order?.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Email</p>
              <p className="text-white">{order?.customerEmail}</p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
          <ol className="space-y-3 text-zinc-300">
            {isDonation && (
              <>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-semibold">1.</span>
                  <span>A confirmation email has been sent to {order?.customerEmail}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-semibold">2.</span>
                  <span>
                    {isRecurring
                      ? 'Your monthly donation will continue automatically'
                      : 'You will receive a tax receipt for your donation'}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-semibold">3.</span>
                  <span>Thank you for supporting our youth programs!</span>
                </li>
              </>
            )}
            {isTicket && (
              <>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-semibold">1.</span>
                  <span>Check your email for digital tickets</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-semibold">2.</span>
                  <span>Bring your ticket confirmation to the event</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-semibold">3.</span>
                  <span>We look forward to seeing you there!</span>
                </li>
              </>
            )}
          </ol>
        </motion.div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Save Receipt
          </button>
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
