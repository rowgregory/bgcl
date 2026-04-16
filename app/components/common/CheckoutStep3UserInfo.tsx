import { formatPhone } from '@/app/lib/utils/phone.utils'
import { IAddress } from '@/types/entities/address.types'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export function CheckoutStep3UserInfo({
  name,
  address,
  setStep,
  phone
}: {
  name: string | null
  address: Partial<IAddress> | null
  setStep: (step: number) => void
  phone?: string
}) {
  const session = useSession()
  const email = session.data?.user?.email
  const [signingOut, setSigningOut] = useState(false)

  if (!name && !address) return null

  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
        Contact
      </legend>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-neutral-50 border-neutral-200 rounded-xl border divide-y dark:divide-neutral-700/50 divide-neutral-200 mb-2"
      >
        {/* Email */}
        <div className="flex items-start gap-2 sm:gap-4 px-4 py-3">
          <p className="text-xs font-medium dark:text-neutral-500 text-neutral-400 shrink-0 w-12 sm:w-24">Email</p>
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-0.5">
            <p className="text-sm dark:text-white text-neutral-900 font-medium truncate">{email || '—'}</p>
            <button
              type="button"
              onClick={async () => {
                setSigningOut(true)
                await signOut({ redirectTo: '/auth/login' })
              }}
              aria-label="Sign out and use a different account"
              className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded self-start"
            >
              {signingOut ? (
                <span className="flex items-center gap-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3 h-3 border border-neutral-400 border-t-transparent rounded-full"
                    aria-hidden="true"
                  />
                  <span>Signing out...</span>
                </span>
              ) : (
                'Not you?'
              )}
            </button>
          </div>
        </div>

        {/* Name */}
        {name.trim() && (
          <div className="flex items-center gap-2 sm:gap-4 px-4 py-3">
            <p className="text-xs font-medium dark:text-neutral-500 text-neutral-400 shrink-0 w-12 sm:w-24">Name</p>
            <p className="text-sm dark:text-white text-neutral-900 font-medium truncate flex-1 min-w-0">{name}</p>
          </div>
        )}

        {/* Phone */}
        {phone.trim() && (
          <div className="flex items-center gap-2 sm:gap-4 px-4 py-3">
            <p className="text-xs font-medium dark:text-neutral-500 text-neutral-400 shrink-0 w-12 sm:w-24">Phone</p>
            <p className="text-sm dark:text-white text-neutral-900 font-medium truncate flex-1 min-w-0">
              {formatPhone(phone)}
            </p>
          </div>
        )}

        {/* Address */}
        {address?.addressLine1 && (
          <div className="flex items-start gap-2 sm:gap-4 px-4 py-3">
            <p className="text-xs font-medium dark:text-neutral-500 text-neutral-400 shrink-0 w-12 sm:w-24 mt-0.5">
              Address
            </p>
            <div className="text-sm dark:text-white text-neutral-900 font-medium space-y-0.5 min-w-0 flex-1">
              <p className="truncate">{address.addressLine1}</p>
              {address.addressLine2 && <p className="truncate">{address.addressLine2}</p>}
              <p className="truncate">
                {[address.city, address.state, address.zipPostalCode].filter(Boolean).join(', ')}
              </p>
              {address.country && <p>{address.country}</p>}
            </div>
          </div>
        )}
      </motion.div>

      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Need to update your details?{' '}
        <button
          type="button"
          onClick={() => setStep(2)}
          aria-label="Go back to update your details"
          className="underline hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
        >
          Go back
        </button>
      </p>
    </fieldset>
  )
}
