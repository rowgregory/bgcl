'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { AlertCircle, LogOut } from 'lucide-react'

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    setFailed(false)

    try {
      await signOut({ redirectTo: '/auth/login' })
    } catch {
      setFailed(true)
      setIsLoading(false)
    }
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      disabled={isLoading}
      aria-label={failed ? 'Log out failed, try again' : 'Log out'}
      title={failed ? 'Log out failed, try again' : 'Log out'}
      className="relative p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 bg-neutral-200 border-neutral-300 hover:bg-neutral-300 rounded-lg transition-all disabled:opacity-50"
    >
      {isLoading ? (
        <div
          className="w-5 h-5 border-2 border-t-0 dark:border-t-indigo-500 border-t-indigo-600 animate-spin rounded-full dark:border-indigo-500 border-indigo-500"
          aria-hidden="true"
        />
      ) : failed ? (
        <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
      ) : (
        <LogOut className="w-5 h-5 dark:text-zinc-400 text-neutral-700" aria-hidden="true" />
      )}
    </motion.button>
  )
}
