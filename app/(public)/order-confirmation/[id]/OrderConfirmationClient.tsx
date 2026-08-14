'use client'

import Picture from '@/components/_shared/Picture'
import { formatEnumLabel } from '@/lib/utils/formatEnumLabel'
import { useCartStore } from '@/stores/useCartStore'
import { useConfettiStore } from '@/stores/useConfettiStore'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ArrowLeft, Download, User, MapPin, Mail } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OrderConfirmationClient({ order }) {
  const isDonation = order?.type?.includes('DONATION')
  const isRecurring = order?.type === 'RECURRING_DONATION'
  const isTicket = order?.type === 'TICKET_PURCHASE'
  const session = useSession()
  const [isExpanded, setIsExpanded] = useState(false)
  const clear = useCartStore((s) => s.clearCart)
  const hide = useConfettiStore((s) => s.hide)

  const maxLength = 80
  const shouldTruncate = order.campaign?.description && order.campaign?.description?.length > maxLength
  const displayText = isExpanded ? order.campaign?.description : order.campaign?.description?.slice(0, maxLength)

  useEffect(() => {
    window.scrollTo(0, 0)
    clear()
    hide()
  }, [clear, hide])

  // const handleGenerateTicketPDF = () => {
  //   generateTicketPDF({
  //     order: {
  //       id: order.id,
  //       customerName: order.customerName,
  //       customerEmail: order.customerEmail,
  //       paidAt: order.paidAt!,
  //       totalAmount: order.totalAmount
  //     },
  //     event: {
  //       title: order.event.title,
  //       subtitle: order.event.subtitle,
  //       date: order.event.date,
  //       location: order.event.location,
  //       address: order.event.address,
  //       raffleTerms: order.event.raffleTerms,
  //       raffleDrawDate: order.event.raffleDrawDate
  //     },
  //     items: order.orderItems.map((i) => ({
  //       ticketName: i.ticketName,
  //       ticketDescription: i.ticketDescription,
  //       pricePerUnit: i.pricePerUnit,
  //       totalPrice: i.totalPrice,
  //       quantity: i.quantity,
  //       raffleTicketNumber: order.event.showRaffleTicketNumbers ? i.raffleTicketNumber : null,
  //       raffleTicketCode: order.event.showRaffleTicketNumbers ? i.raffleTicketCode : null
  //     }))
  //   })
  // }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Compact Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 backdrop-blur bg-white/50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4 lg:px-8 flex items-center justify-between">
          <Link
            href={isDonation ? '/donate' : '/events'}
            className="inline-flex items-center space-x-1 text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Donate</span>
          </Link>
          {session?.data?.user?.id && (
            <Link href="/supporter/overview" className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white leading-none truncate">
                  {session.data.user.email}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 lg:px-8">
        {/* Success Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center rounded-full mb-6"
          >
            <Link href="/" className="flex items-center gap-2 h-20">
              <Picture
                src="/images/vertical-logo-light.png"
                alt="Boys & Girls Club"
                className="h-full w-full block dark:hidden"
                priority
              />
              <Picture
                src="/images/vertical-logo-dark.png"
                alt="Boys & Girls Club"
                className="h-full w-full hidden dark:block"
                priority
              />
            </Link>
          </motion.div>
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-4">
            {isDonation ? 'Thank You for Your Donation!' : 'Your Tickets Are Confirmed!'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            {isDonation
              ? 'Your generous support helps us empower youth in our community.'
              : 'Check your email for ticket details and event information.'}
          </p>
        </motion.div>

        {/* Main Amount Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 mb-8 bg-neutral-50 dark:bg-neutral-800/50"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">
                {isDonation
                  ? isRecurring
                    ? `${order.recurringFrequency} Donation`
                    : 'One-Time Donation'
                  : 'Ticket Purchase'}
              </p>
              <h2 className="text-5xl font-black text-sky-600 dark:text-sky-400">
                ${order?.totalAmount?.toLocaleString()}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Date</p>
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {new Date(order?.paidAt || order?.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Multi-Column Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Donor/Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50"
          >
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
              Customer Info
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Name</p>
                <p className="text-neutral-900 dark:text-white font-semibold">{order?.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Email</p>
                <p className="text-neutral-900 dark:text-white text-sm break-all">{order?.customerEmail}</p>
              </div>
              {order?.customerPhone && (
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Phone</p>
                  <p className="text-neutral-900 dark:text-white">{order.customerPhone}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Billing Address */}
          {order?.billingAddress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50"
            >
              <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                Address
              </h3>
              <div className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                <p className="font-semibold">{order.billingAddress.address || order.billingAddress.addressLine1}</p>
                {order.billingAddress?.addressLine2 && <p>Unit {order.billingAddress?.addressLine2}</p>}
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipPostalCode}
                </p>
                <p>{order.billingAddress.country}</p>
              </div>
            </motion.div>
          )}

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50"
          >
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
              Payment Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Method</p>
                <p className="text-neutral-900 dark:text-white capitalize font-semibold">{order?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Status</p>
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 text-xs font-bold rounded">
                  {order?.status}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Donation Details */}
          {isDonation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50"
            >
              <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                Donation Info
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Type</p>
                  <p className="text-neutral-900 dark:text-white font-semibold">{formatEnumLabel(order?.type)}</p>
                </div>
                {isRecurring && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Frequency</p>
                      <p className="text-neutral-900 dark:text-white capitalize font-semibold">
                        {order?.recurringFrequency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Next Billing</p>
                      <p className="text-neutral-900 dark:text-white font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                        {new Date(order.nextBillingDate!).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Fees Info */}
          {order?.coverFees || (order?.feesCovered && order.feesCovered > 0) ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50"
            >
              <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">Fees</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Cover Fees</p>
                  <p className="text-neutral-900 dark:text-white font-semibold">{order?.coverFees ? 'Yes' : 'No'}</p>
                </div>
                {order?.feesCovered && order.feesCovered > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Amount Covered</p>
                    <p className="text-neutral-900 dark:text-white font-bold">${order.feesCovered.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : null}

          {/* Campaign Info */}
          {order.campaign && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50"
            >
              <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                Campaign
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Name</p>
                  <p className="text-neutral-900 dark:text-white font-semibold">{order.campaign.name}</p>
                </div>
                {order.campaign.description && (
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={isExpanded ? 'expanded' : 'collapsed'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                      >
                        {displayText}
                        {shouldTruncate && !isExpanded && '...'}
                      </motion.p>
                    </AnimatePresence>
                    {shouldTruncate && (
                      <motion.button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-3 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors inline-flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <span>Show less</span>
                            <motion.span animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                              ↓
                            </motion.span>
                          </>
                        ) : (
                          <>
                            <span>Read more</span>
                            <motion.span animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                              ↓
                            </motion.span>
                          </>
                        )}
                      </motion.button>
                    )}{' '}
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Campaign ID</p>
                  <p className="text-neutral-700 dark:text-neutral-300 font-mono text-xs">{order.campaign.id}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Event Info (if ticket) */}
          {isTicket && order?.event && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50"
            >
              <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                Event
              </h3>
              <div className="space-y-3">
                <p className="font-semibold text-neutral-900 dark:text-white">{order.event.title}</p>

                <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" aria-hidden="true" />
                  <span>
                    {new Date(order.event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}{' '}
                    at{' '}
                    {new Date(order.event.date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" aria-hidden="true" />
                  <span>{order.event.location}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Order IDs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50"
          >
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
              Order IDs
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Order ID</p>
                <p className="text-neutral-900 dark:text-white font-mono text-xs break-all">{order?.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Payment Intent</p>
                <p className="text-neutral-900 dark:text-white font-mono text-xs break-all">{order?.paymentIntentId}</p>
              </div>
              {order?.paymentMethodId && (
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Payment Method</p>
                  <p className="text-neutral-900 dark:text-white font-mono text-xs break-all">
                    {order.paymentMethodId}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Notes Section - Full Width */}
        {order?.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-8 bg-neutral-50 dark:bg-neutral-800/50"
          >
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">Notes</h3>
            <p className="text-neutral-700 dark:text-neutral-300">{order.notes}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="p-4 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl mb-8"
        >
          <p className="text-sm text-sky-900 dark:text-sky-400">
            Your donations, tickets, payment methods, and account details are all available in your{' '}
            <Link
              href="/supporter/overview"
              className="font-semibold underline hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              Supporter Overview
            </Link>
            .{isRecurring && ' You can manage or cancel your subscription there at any time.'}
          </p>
        </motion.div>

        {/* Tickets Grid */}
        {isTicket && order?.orderItems && order.orderItems.length > 0 && (
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
              {order.orderItems.map((item, idx) => {
                const isRaffle = !!item.raffleTicketNumber

                return (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden border dark:border-neutral-700 border-neutral-200"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
                  >
                    {/* Header band */}
                    <div className="px-4 py-3 bg-linear-to-r from-sky-600 to-sky-500 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
                          Boys &amp; Girls Club of Lynn
                        </p>
                        <p className="text-sm font-black text-white truncate leading-tight">{item.ticketName}</p>
                      </div>
                      {isRaffle && (
                        <span className="shrink-0 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/20 text-white">
                          Raffle
                        </span>
                      )}
                    </div>

                    {/* Accent stripe */}
                    <div
                      className="h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Body */}
                    <div className="px-4 py-3 dark:bg-neutral-900 bg-white space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs dark:text-neutral-400 text-neutral-500">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-sky-500" aria-hidden="true" />
                          {new Date(order.event.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <p className="text-sm font-black dark:text-white text-neutral-900 tabular-nums">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs dark:text-neutral-400 text-neutral-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-500" aria-hidden="true" />
                        {order.event.location}
                      </div>
                    </div>

                    {/* Tear line */}
                    <div className="relative flex items-center dark:bg-neutral-900 bg-white" aria-hidden="true">
                      <div className="absolute -left-2.5 w-5 h-5 rounded-full dark:bg-neutral-950 bg-neutral-50 border dark:border-neutral-700 border-neutral-200 z-10" />
                      <div className="flex-1 border-t-2 border-dashed dark:border-neutral-700 border-neutral-200 mx-4" />
                      <span className="text-[10px] dark:text-neutral-600 text-neutral-300 px-1 select-none rotate-90">
                        ✂
                      </span>
                      <div className="flex-1 border-t-2 border-dashed dark:border-neutral-700 border-neutral-200 mx-4" />
                      <div className="absolute -right-2.5 w-5 h-5 rounded-full dark:bg-neutral-950 bg-neutral-50 border dark:border-neutral-700 border-neutral-200 z-10" />
                    </div>

                    {/* Stub */}
                    {order?.event?.showRaffleTicketNumbers && (
                      <div className="px-4 py-3 dark:bg-neutral-800/60 bg-neutral-50 flex items-center justify-between gap-3">
                        {isRaffle ? (
                          <>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest dark:text-neutral-500 text-neutral-400">
                                Ticket No.
                              </p>
                              <p className="text-2xl font-black tabular-nums dark:text-sky-400 text-sky-600 leading-none mt-0.5">
                                {String(item.raffleTicketNumber).padStart(4, '0')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-widest dark:text-neutral-500 text-neutral-400">
                                Code
                              </p>
                              <p className="font-mono text-xs dark:text-neutral-300 text-neutral-600 mt-0.5">
                                {item.raffleTicketCode}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <p className="text-xs dark:text-neutral-400 text-neutral-500">
                              {item.quantity} × ${item.pricePerUnit.toFixed(2)}
                            </p>
                            <p className="text-xs font-mono dark:text-neutral-400 text-neutral-500">
                              {order.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">What's Next?</h3>
          <ol className="space-y-3 text-neutral-700 dark:text-neutral-300">
            {isDonation && (
              <>
                <li className="flex gap-3">
                  <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">1.</span>
                  <span>A confirmation email has been sent to {order?.customerEmail}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">2.</span>
                  <span>
                    {isRecurring
                      ? 'Your monthly donation will continue automatically'
                      : 'You will receive a tax receipt for your donation'}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">3.</span>
                  <span>Thank you for supporting our youth programs!</span>
                </li>
              </>
            )}
            {isTicket && (
              <>
                <li className="flex gap-3">
                  <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">1.</span>
                  <span>Check your email for digital tickets</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">2.</span>
                  <span>Bring your ticket confirmation to the event</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">3.</span>
                  <span>We look forward to seeing you there!</span>
                </li>
              </>
            )}
          </ol>
        </motion.div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isTicket ? (
            <div className="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">
                Check your email for confirmation
              </span>
            </div>
          ) : (
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Save Receipt
            </button>
          )}
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold rounded-lg transition-all text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
