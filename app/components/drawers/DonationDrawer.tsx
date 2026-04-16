'use client'

import { setCloseDonationDrawer } from '@/app/lib/store/slices/dashboardSlice'
import { store, useDashboardSelector } from '@/app/lib/store/store'
import { formatDate } from '@/app/lib/utils/date-utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  DollarSign,
  User,
  Mail,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  Check,
  RefreshCw,
  Phone,
  ExternalLink,
  AlertCircle,
  XCircle
} from 'lucide-react'

export function DonationDrawer() {
  const { donation, donationDrawer } = useDashboardSelector()
  const onClose = () => store.dispatch(setCloseDonationDrawer())

  if (!donation) return null

  const openStripeSubscription = () => {
    if (donation.stripeSubscriptionId) {
      const mode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('_test_') ? 'test' : 'live'
      window.open(
        `https://dashboard.stripe.com/acct_1Sngee7U2cwtK0RQ/${mode}/subscriptions/${donation.stripeSubscriptionId}`,
        '_blank'
      )
    }
  }

  const openStripePayment = () => {
    if (donation.paymentIntentId) {
      const mode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('_test_') ? 'test' : 'live'
      window.open(
        `https://dashboard.stripe.com/acct_1Sngee7U2cwtK0RQ/${mode}/payments/${donation.paymentIntentId}`,
        '_blank'
      )
    }
  }

  console.log(donation)

  const isCancelled = donation.status === 'CANCELLED'

  return (
    <AnimatePresence>
      {donationDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-150 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    donation.status === 'FAILED'
                      ? 'bg-red-100 dark:bg-red-900/20'
                      : isCancelled
                        ? 'bg-neutral-200 dark:bg-neutral-800'
                        : 'bg-emerald-100 dark:bg-emerald-900/20'
                  }`}
                >
                  {donation.status === 'FAILED' ? (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  ) : isCancelled ? (
                    <XCircle className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  ) : donation.isRecurring ? (
                    <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                    {donation.status === 'FAILED'
                      ? 'Failed Payment'
                      : isCancelled
                        ? 'Cancelled Subscription'
                        : donation.isRecurring
                          ? 'Recurring Donation'
                          : 'One-Time Donation'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(new Date(donation.createdAt))}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Cancelled Subscription Alert Banner */}
              {isCancelled && (
                <div className="bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        Subscription Cancelled
                      </h3>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        This recurring donation has been cancelled and will no longer be charged.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Failed Payment Alert Banner */}
              {donation.status === 'FAILED' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-red-900 dark:text-red-100 mb-1">Payment Failed</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                        This payment attempt was unsuccessful. The donor was not charged.
                      </p>
                      {donation.failureReason && (
                        <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-700">
                          <p className="text-xs font-semibold text-red-800 dark:text-red-200 mb-1">Failure Reason:</p>
                          <p className="text-sm text-red-700 dark:text-red-300 font-mono">{donation.failureReason}</p>
                          {donation.failureCode && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Code: {donation.failureCode}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Card */}
              <div
                className={`border rounded-2xl p-6 ${
                  donation.status === 'FAILED'
                    ? 'bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800/50'
                    : isCancelled
                      ? 'bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/20 dark:to-neutral-700/20 border-neutral-300 dark:border-neutral-700'
                      : 'bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800/50'
                }`}
              >
                <p
                  className={`text-sm font-semibold mb-2 ${
                    donation.status === 'FAILED'
                      ? 'text-red-800 dark:text-red-300'
                      : isCancelled
                        ? 'text-neutral-700 dark:text-neutral-300'
                        : 'text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {donation.isRecurring
                    ? `${donation.recurringFrequency?.charAt(0).toUpperCase()}${donation.recurringFrequency?.slice(1)} Amount`
                    : 'Donation Amount'}
                </p>
                <p
                  className={`text-4xl font-black ${
                    donation.status === 'FAILED'
                      ? 'text-red-900 dark:text-red-100'
                      : isCancelled
                        ? 'text-neutral-700 dark:text-neutral-300 line-through'
                        : 'text-emerald-900 dark:text-emerald-100'
                  }`}
                >
                  ${donation.totalAmount.toFixed(2)}
                </p>
                {donation.status === 'FAILED' && (
                  <p className="text-xs text-red-700 dark:text-red-400 mt-2 italic">This amount was not charged</p>
                )}
                {isCancelled && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 italic">
                    This subscription was cancelled
                  </p>
                )}
                {donation.coverFees && !isCancelled && donation.status !== 'FAILED' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Covered ${(donation.feesCovered / 100).toFixed(2)} in processing fees
                    </span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                    ${
                      donation.status === 'CONFIRMED'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : donation.status === 'FAILED'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : isCancelled
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }
                  `}
                >
                  {donation.status}
                </span>
                {donation.isRecurring && !isCancelled && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {donation.recurringFrequency}
                  </span>
                )}
              </div>

              {/* Donor Information */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                  Donor Information
                </h3>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Name</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                      {donation.customerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Email</p>

                    <a
                      href={`mailto:${donation.customerEmail}`}
                      className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    >
                      {donation.customerEmail}
                    </a>
                  </div>
                </div>

                {donation.customerPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Phone</p>

                      <a
                        href={`tel:${donation.customerPhone}`}
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {donation.customerPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Billing Address */}
              {donation.billingAddress && (
                <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Billing Address
                  </h3>
                  <div className="text-sm space-y-0.5">
                    {donation.billingAddress.addressLine1 && (
                      <p className="dark:text-white text-neutral-900 font-medium">
                        {donation.billingAddress.addressLine1}
                      </p>
                    )}
                    {donation.billingAddress.addressLine2 && (
                      <p className="dark:text-neutral-300 text-neutral-700">{donation.billingAddress.addressLine2}</p>
                    )}
                    <p className="dark:text-neutral-300 text-neutral-700">
                      {[donation.billingAddress.city, donation.billingAddress.state, donation.billingAddress.zipCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {donation.billingAddress.country && (
                      <p className="dark:text-neutral-500 text-neutral-400 text-xs uppercase tracking-wider font-medium">
                        {donation.billingAddress.country}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                  Payment Details
                </h3>

                {donation.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">
                        {donation.status === 'FAILED' ? 'Attempted At' : isCancelled ? 'Originally Created' : 'Paid At'}
                      </p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {formatDate(new Date(donation.createdAt))}
                      </p>
                    </div>
                  </div>
                )}

                {donation.paymentMethod && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Payment Method</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white capitalize">
                        {donation.paymentMethod}
                      </p>
                    </div>
                  </div>
                )}

                {donation.paymentMethodId && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Payment Method ID</p>
                      <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 truncate">
                        {donation.paymentMethodId}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recurring Details - Only show if not failed and not cancelled */}
              {donation.isRecurring && donation.nextBillingDate && !isCancelled && donation.status !== 'FAILED' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5">
                  <h3 className="text-sm font-black text-blue-900 dark:text-blue-100 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Next Billing
                  </h3>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatDate(new Date(donation.nextBillingDate))}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                    ${donation.totalAmount.toFixed(2)} will be charged {donation.recurringFrequency}
                  </p>
                </div>
              )}

              {/* Notes */}
              {donation.notes && (
                <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{donation.notes}</p>
                </div>
              )}

              {/* Stripe Links */}
              <div className="flex flex-col sm:flex-row gap-2">
                {donation.stripeSubscriptionId && (
                  <button
                    onClick={openStripeSubscription}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#635BFF] hover:bg-[#5851DF] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Subscription in Stripe
                  </button>
                )}
                {donation.paymentIntentId && (
                  <button
                    onClick={openStripePayment}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Payment in Stripe
                  </button>
                )}
              </div>

              {/* Internal IDs (for admins) */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <details className="text-xs">
                  <summary className="cursor-pointer text-neutral-600 dark:text-neutral-400 font-semibold mb-2">
                    Technical Details
                  </summary>
                  <div className="space-y-1 font-mono text-neutral-500 dark:text-neutral-500 mt-2">
                    <p>Order ID: {donation.id}</p>
                    {donation.stripeSubscriptionId && <p>Subscription ID: {donation.stripeSubscriptionId}</p>}
                    {donation.paymentIntentId && <p>Payment Intent: {donation.paymentIntentId}</p>}
                    {donation.userId && <p>User ID: {donation.userId}</p>}
                  </div>
                </details>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
