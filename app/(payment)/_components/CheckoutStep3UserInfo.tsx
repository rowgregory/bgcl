import { useState } from 'react'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import { Address } from '@prisma/client'
import { formatPhone } from '@/lib/utils/phone.utils'

const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 w-20 shrink-0'
const ddCls = 'text-[15px] text-neutral-900 dark:text-white min-w-0'

export function CheckoutStep3UserInfo({
  name,
  address,
  setStep,
  phone
}: {
  name: string
  address: Partial<Address>
  setStep: (step: number) => void
  phone: string
}) {
  const session = useSession()
  const email = session.data?.user?.email
  const [signingOut, setSigningOut] = useState(false)

  const phoneValue = String(phone ?? '').trim()

  if (!name && !address?.addressLine1 && !phoneValue) return null

  return (
    <motion.fieldset
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-0 p-0 m-0"
    >
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <legend className="text-sm text-neutral-500 dark:text-neutral-400">Your details</legend>

        <button
          type="button"
          onClick={() => setStep(2)}
          className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
        >
          Edit
        </button>
      </div>

      <dl className="space-y-2.5">
        <div className="flex items-baseline gap-4">
          <dt className={dtCls}>Email</dt>
          <dd className={`${ddCls} flex items-baseline gap-3 flex-1`}>
            <span className="truncate">{email || '—'}</span>

            <button
              type="button"
              onClick={async () => {
                setSigningOut(true)
                await signOut({ redirectTo: '/auth/login' })
              }}
              aria-label="Sign out and use a different account"
              className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
            >
              {signingOut ? 'Signing out…' : 'Not you?'}
            </button>
          </dd>
        </div>

        {name.trim() && (
          <div className="flex items-baseline gap-4">
            <dt className={dtCls}>Name</dt>
            <dd className={`${ddCls} truncate`}>{name}</dd>
          </div>
        )}

        {phoneValue && (
          <div className="flex items-baseline gap-4">
            <dt className={dtCls}>Phone</dt>
            <dd className={`${ddCls} tabular-nums`}>{formatPhone(phoneValue) ?? phoneValue}</dd>
          </div>
        )}

        {address?.addressLine1 && (
          <div className="flex items-baseline gap-4">
            <dt className={dtCls}>Address</dt>
            <dd className={ddCls}>
              {[
                address.addressLine1,
                address.addressLine2,
                [address.city, address.state, address.zipPostalCode].filter(Boolean).join(', ')
              ]
                .filter(Boolean)
                .map((line, i) => (
                  <span key={i} className="block truncate">
                    {line}
                  </span>
                ))}
            </dd>
          </div>
        )}
      </dl>
    </motion.fieldset>
  )
}
