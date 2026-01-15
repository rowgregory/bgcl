import { FC, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { drawerVariants } from '@/app/lib/constants/motion'
import { ILayout } from '@/types/common'

const Drawer: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <motion.div
      variants={drawerVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className={`${className ?? 'max-w-2xl'} fixed right-0 top-0 h-full w-full bg-neutral-900/95 backdrop-blur-xl border-l border-neutral-700/50 z-50 flex flex-col shadow-2xl overflow-hidden`}
    >
      {children}
    </motion.div>
  )
}

export default Drawer
