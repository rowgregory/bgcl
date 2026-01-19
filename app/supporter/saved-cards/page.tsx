'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Trash2, Plus, CheckCircle } from 'lucide-react'

interface SavedCard {
  id: string
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

interface SavedCardsPageProps {
  cards: SavedCard[]
}

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

export default function SavedCardsPage({ cards }: SavedCardsPageProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (cardId: string) => {
    setDeleting(true)
    try {
      // Call delete API
      //   await fetch(`/api/cards/${cardId}`, { method: 'DELETE' })
      setDeleteId(null)
      // Refresh cards
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete card:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-linear-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black dark:text-white text-neutral-900">Saved Cards</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your payment methods</p>
              </div>
            </div>
          </div>
        </motion.div>

        {cards && cards.length > 0 ? (
          <div className="space-y-4">
            {/* Cards Grid */}
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md">
                  {/* Card Visual */}
                  <div
                    className={`bg-linear-to-br ${getBrandColor(card.brand)} p-6 text-white relative overflow-hidden`}
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-12">
                        <CreditCard className="w-8 h-8" />
                        <span className="text-sm font-semibold uppercase tracking-wider">{card.brand}</span>
                      </div>

                      <div className="mb-8">
                        <p className="text-sm opacity-75 mb-2">Card Number</p>
                        <p className="text-2xl font-mono tracking-widest">•••• •••• •••• {card.last4}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs opacity-75">Expires</p>
                          <p className="font-semibold">
                            {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                          </p>
                        </div>
                        {card.isDefault && (
                          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Default
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 py-4 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {card.isDefault ? 'Default payment method' : 'Saved payment method'}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteId(card.id)}
                      className="text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
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
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold dark:text-white text-neutral-900 mb-2">No saved cards</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">Add a payment method to make donations faster</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Card
            </motion.button>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-6"
        >
          <h3 className="font-semibold text-sky-900 dark:text-sky-200 mb-2">Your cards are secure</h3>
          <p className="text-sm text-sky-800 dark:text-sky-300">
            We use industry-standard encryption to protect your payment information. Your card details are never stored
            on our servers.
          </p>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-sm border border-neutral-200 dark:border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold dark:text-white text-neutral-900 mb-2">Delete Card?</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              This card will be removed from your saved payment methods. You can add it again later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteId && handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
