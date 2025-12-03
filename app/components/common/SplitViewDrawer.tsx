import { ILayout } from '@/types/common'
import { FC } from 'react'
import { motion } from 'framer-motion'
import { drawerVariants } from '@/app/lib/constants/motion'

const SplitViewDrawer: FC<ILayout> = ({ children }) => {
  return (
    <motion.div
      variants={drawerVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="fixed right-0 top-0 h-full w-full max-w-5xl bg-white z-50 flex flex-col shadow-2xl overflow-hidden"
    >
      {children}
    </motion.div>
  )
}

export default SplitViewDrawer
