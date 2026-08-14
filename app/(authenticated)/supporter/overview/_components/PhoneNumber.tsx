import { updatePhoneNumber } from '@/lib/actions/user/updatePhoneNumber'
import { formatPhone } from '@/lib/utils/phone.utils'
import { motion } from 'framer-motion'
import { Check, Loader2, Pencil, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'

export function PhoneNumber({ phone }) {
  const router = useRouter()
  const [editingPhone, setEditingPhone] = useState(false)
  const [savingPhone, setSavingPhone] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(phone ?? '')
  const [message, setMessage] = useState<InlineMessageState | null>(null)

  async function handleSavePhone() {
    setMessage(null)

    if (!phoneNumber.trim()) {
      setMessage({ type: 'error', message: 'Enter a phone number before saving.' })
      return
    }

    setSavingPhone(true)

    try {
      const res = await updatePhoneNumber({ phone: phoneNumber.trim() })

      if (res && res.success === false) {
        setMessage({
          type: 'error',
          message: 'Could not update your phone number',
          description: extractErrorMessage(res)
        })
        return
      }

      setEditingPhone(false)
      router.refresh()

      setMessage({
        type: 'success',
        message: 'Phone number updated',
        description: `Your phone number has been updated to ${formatPhone(phoneNumber.trim())}.`
      })
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        message: 'Could not update your phone number',
        description: extractErrorMessage(error)
      })
    } finally {
      setSavingPhone(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold dark:text-white text-neutral-900">Your Phone Number</h2>
          <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">Used for our records only</p>
        </div>
      </div>

      <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-3" />

      <div className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            {editingPhone ? (
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                aria-label="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={() => setPhoneNumber(formatPhone(phoneNumber) ?? phoneNumber)}
                placeholder="(555) 444-3333"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSavePhone()}
                className="w-40 px-3 py-1.5 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-200 text-neutral-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            ) : (
              <p className="text-sm font-medium dark:text-white text-neutral-900">
                {formatPhone(phone) || (
                  <span className="dark:text-neutral-500 text-neutral-400 italic">No phone set</span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {editingPhone ? (
            <>
              <button
                onClick={handleSavePhone}
                disabled={savingPhone}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 active:scale-95"
              >
                {savingPhone ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                {savingPhone ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditingPhone(false)
                  setMessage(null)
                  setPhoneNumber(phone ?? '')
                }}
                disabled={savingPhone}
                className="text-xs font-medium dark:text-neutral-400 text-neutral-500 hover:dark:text-white hover:text-neutral-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMessage(null)
                setEditingPhone(true)
              }}
              className="flex items-center gap-1.5 text-xs font-medium dark:text-neutral-500 text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors"
              aria-label="Edit your phone number"
            >
              <Pencil className="w-3 h-3" aria-hidden="true" />
              Edit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
