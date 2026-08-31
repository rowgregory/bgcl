import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { updatePhoneNumber } from '@/lib/actions/user/updatePhoneNumber'
import { formatPhone } from '@/lib/utils/phone.utils'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'

const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600'
const inputCls =
  'px-2.5 py-1.5 text-[13px] bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all'
const actionCls =
  'text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1'

export function PhoneNumber({ phone }) {
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(phone ?? '')
  const [message, setMessage] = useState<InlineMessageState | null>(null)

  const handleSave = async () => {
    setMessage(null)

    if (!phoneNumber.trim()) {
      setMessage({ type: 'error', message: 'Enter a phone number before saving.' })
      return
    }

    setSaving(true)

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

      setEditing(false)
      router.refresh()
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        message: 'Could not update your phone number',
        description: extractErrorMessage(error)
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setMessage(null)
    setPhoneNumber(phone ?? '')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-3" />

      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-6 min-w-0">
          <span className={`${dtCls} w-16 shrink-0`}>Phone</span>

          {editing ? (
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
              className={`${inputCls} w-40 tabular-nums`}
            />
          ) : (
            <p className="text-[13px] text-neutral-900 dark:text-white tabular-nums truncate">
              {formatPhone(phone) || <span className="text-neutral-400 dark:text-neutral-600">Not set</span>}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {editing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`${actionCls} text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300`}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white`}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMessage(null)
                setEditing(true)
              }}
              aria-label="Edit your phone number"
              className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white`}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
