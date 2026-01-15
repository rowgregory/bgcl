import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { showToast } from '../../lib/store/slices/toastSlice'
import { useAppDispatch } from '../../lib/store/store'

const LogoutButton = () => {
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const handleLogout = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await signOut({
        redirect: false, // Prevent automatic redirect
        callbackUrl: '/auth/login' // Optional: specify where to redirect after signout
      })

      push('/auth/login')
      setIsLoading(false)
    } catch (error: unknown) {
      dispatch(
        showToast({
          type: 'error',
          message: 'Logout Fail',
          description: error instanceof Error ? error.message : 'An error occurred'
        })
      )
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="relative p-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-all"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-t-0 border-indigo-500 animate-spin rounded-full" />
      ) : (
        <LogOut className="w-5 h-5 text-zinc-400" />
      )}
    </motion.button>
  )
}

export default LogoutButton
