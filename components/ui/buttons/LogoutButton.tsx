import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { setIsLoading } from '@/lib/store/slices/formSlice'
import { store, useFormSelector } from '@/lib/store/store'
import { showToast } from '@/lib/store/slices/toastSlice'

const LogoutButton = () => {
  const { isLoading } = useFormSelector()

  const handleLogout = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      store.dispatch(setIsLoading(true))
      await signOut({
        callbackUrl: '/auth/login'
      })
    } catch (error: unknown) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Logout Fail',
          description: error instanceof Error ? error.message : 'An error occurred'
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="relative p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 bg-neutral-200 border-neutral-300 hover:bg-neutral-300 rounded-lg transition-all"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-t-0 dark:border-t-indigo-500 border-t-indigo-600 dark:animate-spin animate-spin rounded-full dark:border-indigo-500 border-indigo-500" />
      ) : (
        <LogOut className="w-5 h-5 dark:text-zinc-400 text-neutral-700" />
      )}
    </motion.button>
  )
}

export default LogoutButton
