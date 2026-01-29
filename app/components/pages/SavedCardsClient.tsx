'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CreditCard, Trash2, Plus, ArrowLeft, AlertTriangle, Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import LogoutButton from '../buttons/LogoutButton'
import Picture from '../common/Picture'
import { MotionLink } from '../common/MotionLink'
import { deletePaymentMethod } from '@/app/lib/actions/deletePaymentMethod'
import { useRouter } from 'next/navigation'
import { store } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { setOpenPaymentMethodDrawer } from '@/app/lib/store/slices/appSlice'
import { setDefaultPaymentMethod } from '@/app/lib/actions/setDefaultPaymentMethod'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'

const brandColors = {
  visa: 'from-blue-600 to-blue-700',
  mastercard: 'from-red-600 to-orange-600',
  amex: 'from-purple-600 to-purple-700',
  discover: 'from-orange-600 to-yellow-600',
  default: 'from-neutral-600 to-neutral-700'
}

const getBrandColor = (brand: string) => {
  return brandColors[brand.toLowerCase() as keyof typeof brandColors] || brandColors.default
}

export default function SavedCardsClient({ cards }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [settingDefault, setSettingDefault] = useState<string | null>(null)
  const session = useSession()
  const router = useRouter()

  const handleDelete = async (cardId: string) => {
    setDeleting(true)
    try {
      await deletePaymentMethod(cardId)
      setDeleteId(null)
      router.refresh()
      store.dispatch(showToast({ message: 'Payment method successfully deleted!' }))
    } catch (error) {
      store.dispatch(showToast({ message: 'Failed to delete payment method', type: 'error' }))
    } finally {
      setDeleting(false)
    }
  }

  const handleSetDefault = async (cardId: string) => {
    setSettingDefault(cardId)
    try {
      const result = await setDefaultPaymentMethod(cardId)

      if (result.success) {
        store.dispatch(
          showToast({
            type: 'success',
            message: 'Default payment method updated',
            description: 'Your default card has been changed successfully.'
          })
        )
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Failed to update default',
          description: extractErrorMessage(error)
        })
      )
    } finally {
      setSettingDefault(null)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Compact Header */}
      <div className="px-6 md:px-8 lg:px-12 pb-4 pt-6 md:pt-8 dark:border-neutral-800 border-neutral-200 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/supporter/overview"
            className="inline-flex items-center space-x-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Overview</span>
          </Link>
          <MotionLink href="/" className="flex space-x-3 w-28 h-auto">
            <Picture
              src="/images/vertical-logo-light.png"
              alt="Boys & Girls Club"
              className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
              priority={true}
            />
            <Picture
              src="/images/vertical-logo-dark.png"
              alt="Boys & Girls Club"
              className="dark:block hidden w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
              priority={true}
            />
          </MotionLink>
          {session.data?.user?.id && <LogoutButton />}
        </div>
      </div>

      <div className="px-4 py-12 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black dark:text-white text-neutral-900">Payment Methods</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">Manage your saved cards securely</p>
              </div>

              <motion.button
                onClick={() => store.dispatch(setOpenPaymentMethodDrawer())}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add Card
              </motion.button>
            </div>
          </motion.div>

          {cards && cards?.data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Cards Grid */}
              {cards?.data?.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group h-full"
                >
                  <div className="h-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 flex flex-col">
                    {/* Card Visual */}
                    <div
                      className={`bg-linear-to-br ${getBrandColor(card.cardBrand)} p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-between`}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-16">
                          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                            {card.cardBrand}
                          </span>
                        </div>

                        <div className="mb-12">
                          <p className="text-xs opacity-70 mb-2 uppercase tracking-wide font-semibold">Card Number</p>
                          <p className="text-2xl font-mono tracking-widest font-bold">
                            •••• •••• •••• {card.cardLast4}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs opacity-70 uppercase tracking-wide font-semibold mb-1">Expires</p>
                            <p className="text-lg font-semibold">
                              {String(card.cardExpMonth).padStart(2, '0')}/{card.cardExpYear}
                            </p>
                          </div>
                          {card.isDefault && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-1.5 bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                            >
                              <Star className="w-4 h-4 fill-white" />
                              Default
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Info & Actions */}
                    <div className="px-6 py-5 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                          Cardholder Name
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                          {card.cardholderName || 'Not provided'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-4 relative">
                        {/* Default Badge */}
                        {card.isDefault && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="absolute bottom-0 left-0 z-20 flex items-center gap-1.5 bg-sky-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            Default
                          </motion.div>
                        )}
                        {/* Set as Default Radio */}
                        {!card.isDefault && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSetDefault(card.id)}
                            disabled={settingDefault === card.id}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 hover:border-sky-500 dark:hover:border-sky-500 text-neutral-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                            title="Set as default payment method"
                          >
                            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                              {settingDefault === card.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 rounded-full bg-current"
                                />
                              )}
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              {settingDefault === card.id ? 'Setting...' : 'Make Default'}
                            </span>
                          </motion.button>
                        )}

                        {/* Delete Button */}
                        {!card.isDefault && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteId(card.id)}
                            className="p-2.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete card"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-2xl font-black dark:text-white text-neutral-900 mb-3">No Payment Methods</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto text-lg">
                Add a payment method to make donations faster and easier
              </p>
              <motion.button
                onClick={() => store.dispatch(setOpenPaymentMethodDrawer())}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add Your First Card
              </motion.button>
            </motion.div>
          )}

          {/* Security Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 bg-linear-to-br from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-800/10 border border-sky-200 dark:border-sky-800/50 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-sky-600/10 rounded-lg shrink-0">
                <svg className="w-6 h-6 text-sky-600 dark:text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-sky-900 dark:text-sky-200 mb-2">Your cards are secure</h3>
                <p className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed">
                  We use industry-standard encryption and PCI compliance to protect your payment information. Your full
                  card number and security code are never stored on our servers. All transactions are securely processed
                  by Stripe.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-sm border border-neutral-200 dark:border-neutral-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              <h3 className="text-xl font-bold dark:text-white text-neutral-900 mb-3 text-center">
                Delete Payment Method?
              </h3>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 text-center leading-relaxed">
                This card will be permanently removed from your saved payment methods. You can add it again anytime.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteId && handleDelete(deleteId)}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-600/50 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete Card'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
