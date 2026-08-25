'use client'

import { useState } from 'react'
import { updateUserRole } from '@/lib/actions/user/updateUserRole'
import { Check, Loader2 } from 'lucide-react'
import { ROLE_COLORS, ROLE_LABEL } from '../_users.constants'

const ASSIGNABLE_ROLES = ['SUPPORTER', 'PROGRAM', 'ADMIN'] as const

export function RoleEditor({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [role, setRole] = useState(currentRole)
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  if (currentRole === 'SUPER') {
    return (
      <div>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 uppercase tracking-wider font-semibold mb-2">
          Role
        </p>
        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${ROLE_COLORS.SUPERUSER ?? ''}`}>
          {ROLE_LABEL.SUPER ?? 'SUPERUSER'}
        </span>
      </div>
    )
  }

  const handleSelect = async (next: string) => {
    if (next === role || pending) return

    const previous = role

    setRole(next)
    setPending(next)
    setError('')
    setSaved(false)

    const result = await updateUserRole(userId, { role: next })

    setPending(null)

    if (!result.success) {
      setRole(previous)
      setError(result.error ?? 'Could not update the role.')
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-500 uppercase tracking-wider font-semibold">Role</p>
        {saved && <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />}
      </div>

      <div
        role="radiogroup"
        aria-label="User role"
        className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900"
      >
        {ASSIGNABLE_ROLES.map((value) => {
          const active = role === value

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={pending !== null}
              onClick={() => handleSelect(value)}
              className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                active
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              } ${pending && !active ? 'opacity-50' : ''}`}
            >
              {pending === value && <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />}
              {ROLE_LABEL[value] ?? value}
            </button>
          )
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {pending ? 'Saving role' : saved ? 'Role updated' : ''}
      </p>

      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-2">{error}</p>}
    </div>
  )
}
