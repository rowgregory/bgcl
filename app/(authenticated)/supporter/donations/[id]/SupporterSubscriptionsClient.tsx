'use client'

import { Calendar, CreditCard, XCircle, CheckCircle, AlertCircle, Download, FileText, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { containerVariants, itemVariants } from '@/lib/constants/motion'
import { SubscriptionClientProps } from '../../_types/subscription.types'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { useCancelSubscriptionDrawer } from '@/stores/drawers'

export const dynamic = 'force-dynamic'

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString || dateString === 'null' || dateString === 'undefined') return 'N/A'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'N/A'

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export default function SupporterSubscriptionsClient({ data }: SubscriptionClientProps) {
  const open = useCancelSubscriptionDrawer((s) => s.open)
  const { subscription, order, isCancelled, willCancelAtPeriodEnd, isActive, isPastDue, isUnpaid } = data

  const getStatusBadge = () => {
    if (isCancelled) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
          <XCircle className="w-4 h-4" />
          Cancelled
        </span>
      )
    }
    if (willCancelAtPeriodEnd) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          Cancelling Soon
        </span>
      )
    }
    if (isPastDue) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          Past Due
        </span>
      )
    }
    if (isUnpaid) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
          <XCircle className="w-4 h-4" />
          Unpaid
        </span>
      )
    }
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 rounded-full text-sm font-medium">
        {subscription.status}
      </span>
    )
  }

  const amount = order?.totalAmount || 0
  const frequency = order?.recurringFrequency || subscription.items[0]?.price.recurring.interval || 'monthly'
  const item = subscription.items[0]

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      <div className="p-6 md:p-8 lg:p-12 space-y-8">
        <div className="max-w-334 mx-auto space-y-8">
          {/* Header */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Link
                    href="/supporter/donations"
                    className="flex items-center gap-x-2 dark:text-neutral-600 text-neutral-500 hover:dark:text-neutral-400 hover:text-neutral-700 transition-colors text-xs font-semibold uppercase tracking-widest"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    My Donations
                  </Link>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 leading-tight">
                    {formatCurrency(item?.price.unit_amount || amount * 100)}/
                    {frequency === 'year' || frequency === 'yearly' ? 'year' : 'month'}
                  </h1>
                  <p className="dark:text-neutral-500 text-neutral-600 text-lg">
                    Recurring donation to Boys & Girls Club of Lynn
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {getStatusBadge()}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Customer Name */}
            <motion.div
              className="group relative dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-5 overflow-hidden dark:hover:border-neutral-700 hover:border-neutral-300 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 dark:bg-linear-to-br dark:from-sky-500/5 dark:to-transparent bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative space-y-3">
                <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider">
                  Donor Name
                </p>
                <p className="text-xl font-bold dark:text-white text-neutral-900">{order?.customerName || 'N/A'}</p>
              </div>
            </motion.div>

            {/* Next Billing */}
            <motion.div
              className="group relative dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-5 overflow-hidden dark:hover:border-neutral-700 hover:border-neutral-300 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 dark:bg-linear-to-br dark:from-sky-500/5 dark:to-transparent bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative space-y-3">
                <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {willCancelAtPeriodEnd ? 'Cancels On' : isCancelled ? 'Cancelled' : 'Next Billing'}
                </p>
                <p className="text-xl font-bold dark:text-white text-neutral-900">
                  {willCancelAtPeriodEnd ? (
                    <span className="text-amber-600 dark:text-amber-400">
                      {formatDate(subscription.current_period_end)}
                    </span>
                  ) : isCancelled ? (
                    <span className="text-red-600 dark:text-red-400">{formatDate(subscription.canceled_at)}</span>
                  ) : (
                    formatDate(subscription.current_period_end)
                  )}
                </p>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              className="group relative dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-5 overflow-hidden dark:hover:border-neutral-700 hover:border-neutral-300 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 dark:bg-linear-to-br dark:from-sky-500/5 dark:to-transparent bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative space-y-3">
                <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  Payment Method
                </p>
                <p className="text-xl font-bold dark:text-white text-neutral-900">
                  {subscription.default_payment_method?.card ? (
                    <span>
                      {subscription.default_payment_method.card.brand.charAt(0).toUpperCase() +
                        subscription.default_payment_method.card.brand.slice(1)}{' '}
                      •••• {subscription.default_payment_method.card.last4}
                    </span>
                  ) : (
                    'Card'
                  )}
                </p>
              </div>
            </motion.div>

            {/* Member Since */}
            <motion.div
              className="group relative dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-5 overflow-hidden dark:hover:border-neutral-700 hover:border-neutral-300 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 dark:bg-linear-to-br dark:from-sky-500/5 dark:to-transparent bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative space-y-3">
                <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider">
                  Member Since
                </p>
                <p className="text-xl font-bold dark:text-white text-neutral-900">{formatDate(subscription.created)}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Info Card */}
          <motion.div
            className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-4">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm dark:text-neutral-500 text-neutral-600 mb-1">Email</p>
                <p className="text-lg dark:text-white text-neutral-900 wrap-break-word">
                  {order?.customerEmail || 'N/A'}
                </p>
              </div>
              {order?.customerPhone && (
                <div>
                  <p className="text-sm dark:text-neutral-500 text-neutral-600 mb-1">Phone</p>
                  <p className="text-lg dark:text-white text-neutral-900">{order.customerPhone}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Latest Invoice */}
          {subscription.latest_invoice && (
            <motion.div
              className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Latest Invoice
              </h3>

              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm dark:text-neutral-500 text-neutral-600 mb-1">Amount</p>
                  <p className="text-2xl font-bold dark:text-white text-neutral-900">
                    {formatCurrency(subscription.latest_invoice.amount_paid)}
                  </p>
                </div>
                <div>
                  <p className="text-sm dark:text-neutral-500 text-neutral-600 mb-1">Status</p>
                  <p className="text-lg font-semibold dark:text-white text-neutral-900 capitalize">
                    {subscription.latest_invoice.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm dark:text-neutral-500 text-neutral-600 mb-1">Date</p>
                  <p className="text-lg font-semibold dark:text-white text-neutral-900">
                    {formatDate(subscription.latest_invoice.created)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {subscription.latest_invoice.hosted_invoice_url && (
                  <motion.a
                    href={subscription.latest_invoice.hosted_invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-semibold"
                  >
                    <FileText className="w-4 h-4" />
                    View Invoice
                  </motion.a>
                )}
                {subscription.latest_invoice.invoice_pdf && (
                  <motion.a
                    href={subscription.latest_invoice.invoice_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-200 hover:bg-neutral-300 dark:text-neutral-300 text-neutral-700 rounded-lg transition-colors text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}

          {/* Cancellation Warning */}
          {willCancelAtPeriodEnd && (
            <motion.div
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Subscription Ending Soon</h3>
                  <p className="text-amber-800 dark:text-amber-400 text-sm">
                    Your subscription will end on {formatDate(subscription.current_period_end)}. You can reactivate it
                    anytime before then.
                  </p>
                  {subscription.cancellation_details?.comment && (
                    <p className="text-amber-700 dark:text-amber-500 text-sm mt-2 italic">
                      Note: {subscription.cancellation_details.comment}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-6">
              Manage Subscription
            </h3>

            <div className="space-y-3">
              {!isCancelled && !willCancelAtPeriodEnd && (
                <div className="flex justify-start">
                  <motion.button
                    onClick={() => {
                      open({
                        subscriptionAmount: data?.subscription?.items?.[0]?.price?.unit_amount,
                        nextBillingDate: data.subscription.current_period_end,
                        subscriptionId: subscription.id
                      })
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-neutral-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Subscription
                  </motion.button>
                </div>
              )}
              {isCancelled && (
                <div className="text-center py-4 dark:text-neutral-500 text-neutral-600">
                  This subscription has been cancelled. Thank you for your support!
                </div>
              )}
            </div>
          </motion.div>

          {/* Support */}
          <div className="text-center">
            <p className="text-sm dark:text-neutral-500 text-neutral-600">
              Need help? Contact us at{' '}
              <a href="mailto:support@bgcl.org" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">
                info@bgcl.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
