import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAddressModal } from '@/stores/drawers'
import { deleteAddress } from '@/lib/actions/address/deleteAddress'
import { Loader2, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'

export function Address({ address }) {
  const router = useRouter()
  const [deletingAddress, setDeletingAddress] = useState(false)
  const [message, setMessage] = useState<InlineMessageState | null>(null)
  const openAddressModal = useAddressModal((s) => s.open)

  async function handleDeleteAddress() {
    setMessage(null)
    setDeletingAddress(true)

    try {
      const res = await deleteAddress()

      if (res && res.success === false) {
        setMessage({
          type: 'error',
          message: 'Could not remove your address',
          description: extractErrorMessage(res)
        })
        return
      }

      router.refresh()

      setMessage({
        type: 'success',
        message: 'Address removed',
        description: 'Your billing address has been cleared.'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        message: 'Could not remove your address',
        description: extractErrorMessage(error)
      })
    } finally {
      setDeletingAddress(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold dark:text-white text-neutral-900">Mailing Address</h2>
        <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">
          Used for ticket delivery and correspondence
        </p>
      </div>

      <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-3" />

      {address?.addressLine1 ? (
        <div className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-4 sm:flex sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center mt-0.5"
              aria-hidden="true"
            >
              <MapPin className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider">
                Mailing Address
              </p>
              <p className="text-sm font-medium dark:text-white text-neutral-900 truncate">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="text-sm dark:text-neutral-400 text-neutral-600 truncate">{address.addressLine2}</p>
              )}
              <p className="text-sm dark:text-neutral-400 text-neutral-600 truncate">
                {[address.city, address.state, address.zipPostalCode].filter(Boolean).join(', ')}
              </p>
              {address.country && <p className="text-sm dark:text-neutral-400 text-neutral-600">{address.country}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 dark:border-neutral-800 border-neutral-200">
            <button
              onClick={() => {
                setMessage(null)
                openAddressModal(address)
              }}
              disabled={deletingAddress}
              aria-label="Edit mailing address"
              className="flex items-center gap-1.5 text-xs font-medium dark:text-neutral-500 text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              <Pencil className="w-3 h-3" aria-hidden="true" />
              Edit
            </button>
            <button
              onClick={handleDeleteAddress}
              disabled={deletingAddress}
              aria-label="Remove mailing address"
              className="flex items-center gap-1.5 text-xs font-medium text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
            >
              {deletingAddress ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                  Remove
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="dark:bg-neutral-900/50 dark:border-neutral-800 dark:border-dashed bg-neutral-50 border-neutral-200 border border-dashed rounded-xl p-4">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                aria-hidden="true"
              >
                <MapPin className="w-3.5 h-3.5 dark:text-neutral-500 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-semibold dark:text-neutral-300 text-neutral-700">
                  No mailing address on file
                </p>
                <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                  Required for physical ticket delivery and checkout
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setMessage(null)
                openAddressModal()
              }}
              aria-label="Add mailing address"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Add Address
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
