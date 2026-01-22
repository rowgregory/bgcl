import React from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronDown } from 'lucide-react'
import { useAppDispatch, useDashboardSelector } from '@/app/lib/store/store'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { setOpenActionMenu } from '../../lib/store/slices/dashboardSlice'

const ActionMenuButton = () => {
  const dispatch = useAppDispatch()
  const { actionMenu } = useDashboardSelector()
  const { play } = useSoundEffect('/sound-effects/action-menu-1.mp3', true)

  const handleOpenActionMenu = () => {
    play()
    dispatch(setOpenActionMenu())
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleOpenActionMenu}
      className="px-4 py-2 dark:bg-linear-to-r dark:from-cyan-600 dark:to-sky-600 dark:hover:from-sky-600 dark:hover:to-cyan-600 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-500 text-white rounded-lg transition-all flex items-center space-x-2 font-medium dark:shadow-lg shadow text-sm cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      <span>Actions</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${actionMenu ? 'rotate-180' : ''}`} />
    </motion.button>
  )
}

export default ActionMenuButton
