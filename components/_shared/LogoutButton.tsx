'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    setFailed(false)

    try {
      await signOut({ redirect: false })
      router.push('/auth/login')
      router.refresh()
    } catch {
      setFailed(true)
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      aria-label={failed ? 'Log out failed, try again' : 'Log out'}
      title={failed ? 'Log out failed, try again' : 'Log out'}
      className={`p-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shrink-0 ${
        failed
          ? 'text-red-500 hover:text-red-600 dark:hover:text-red-400'
          : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
      }`}
    >
      <LogOut className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} aria-hidden="true" />
    </button>
  )
}
