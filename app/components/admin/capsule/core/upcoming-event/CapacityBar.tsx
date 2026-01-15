import { FC } from 'react'
import { motion } from 'framer-motion'

interface ICapacityBar {
  progress: number
  index: number
}

export const CapacityBar: FC<ICapacityBar> = ({ progress, index }) => (
  <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
      className="h-full bg-linear-to-r from-purple-600 to-blue-600 rounded-full"
    />
  </div>
)
