import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const CloseDrawerButton: FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClose}
      className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-all"
      initial={{ opacity: 0, rotate: -90 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <X className="w-5 h-5" />
    </motion.button>
  )
}

export default CloseDrawerButton
