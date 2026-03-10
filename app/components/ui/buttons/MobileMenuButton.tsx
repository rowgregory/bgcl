import { motion } from 'framer-motion'
import { useAppDispatch } from '@/app/lib/store/store'
import { setOpenMobileNavigation } from '@/app/lib/store/slices/appSlice'
import { Menu } from 'lucide-react'

const MobileMenuButton = () => {
  const dispatch = useAppDispatch()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => dispatch(setOpenMobileNavigation())}
      className="block lg:hidden relative p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 bg-neutral-200 border-neutral-300 hover:bg-neutral-300 rounded-lg transition-all border"
    >
      <Menu className="dark:w-5 dark:h-5 dark:text-zinc-400 w-5 h-5 text-neutral-700" />
    </motion.button>
  )
}

export default MobileMenuButton
