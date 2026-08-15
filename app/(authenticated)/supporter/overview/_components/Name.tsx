import { updateUserName } from '@/lib/actions/user/updateUserName'
import { motion } from 'framer-motion'
import { Check, Loader2, Pencil, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'

export function Name({ firstName, lastName, name, setFirstName, setLastName }) {
  const router = useRouter()
  const session = useSession()
  const [editingName, setEditingName] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [message, setMessage] = useState<InlineMessageState | null>(null)

  async function handleSaveName() {
    setMessage(null)

    if (!firstName.trim() && !lastName.trim()) {
      setMessage({ type: 'error', message: 'Enter a first or last name before saving.' })
      return
    }

    setSavingName(true)

    try {
      const res = await updateUserName({ firstName: firstName.trim(), lastName: lastName.trim() })

      if (res && res.success === false) {
        setMessage({
          type: 'error',
          message: 'Could not update your name',
          description: extractErrorMessage(res)
        })
        return
      }

      setEditingName(false)
      router.refresh()

      setMessage({
        type: 'success',
        message: 'Name updated',
        description: `Your name has been updated to ${[firstName.trim(), lastName.trim()].filter(Boolean).join(' ')}.`
      })
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        message: 'Could not update your name',
        description: extractErrorMessage(error)
      })
    } finally {
      setSavingName(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold dark:text-white text-neutral-900">Your Name</h2>
          <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">
            Used on your tickets and confirmations
          </p>
        </div>
      </div>

      <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-3" />

      <div className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center">
            <User className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First"
                  aria-label="First name"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="w-28 px-3 py-1.5 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-200 text-neutral-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last"
                  aria-label="Last name"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="w-28 px-3 py-1.5 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-200 text-neutral-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium dark:text-white text-neutral-900">
                  {[firstName, lastName].filter(Boolean).join(' ') || (
                    <span className="dark:text-neutral-500 text-neutral-400 italic">No name set</span>
                  )}
                </p>
                <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">{session.data?.user?.email}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {editingName ? (
            <>
              <button
                onClick={handleSaveName}
                disabled={savingName}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 active:scale-95"
              >
                {savingName ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                {savingName ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditingName(false)
                  setMessage(null)
                  setFirstName(name?.firstName ?? '')
                  setLastName(name?.lastName ?? '')
                }}
                disabled={savingName}
                className="text-xs font-medium dark:text-neutral-400 text-neutral-500 hover:dark:text-white hover:text-neutral-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMessage(null)
                setEditingName(true)
              }}
              className="flex items-center gap-1.5 text-xs font-medium dark:text-neutral-500 text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors"
              aria-label="Edit your name"
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
