'use client'

import { useState, useTransition } from 'react'
import { setToggleModal } from '@/lib/actions/page/setToggleModal'

export function ModalToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [error, setError] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const previous = enabled

    setEnabled(!previous)
    setError(false)

    startTransition(async () => {
      const result = await setToggleModal('home')

      if (!result.success) {
        setEnabled(previous)
        setError(true)
      }
    })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={handleToggle}
      disabled={isPending}
      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-[13px] dark:text-neutral-400 text-neutral-600 dark:hover:bg-neutral-900 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="truncate">{error ? 'Toggle failed' : 'Home modal'}</span>

      <span
        aria-hidden="true"
        className={`w-8 h-4 rounded-full p-0.5 shrink-0 transition-colors ${
          enabled ? 'bg-sky-600' : 'dark:bg-neutral-700 bg-neutral-300'
        }`}
      >
        <span
          className={`block w-3 h-3 rounded-full bg-white transition-transform ${enabled ? 'translate-x-4' : ''}`}
        />
      </span>
    </button>
  )
}
