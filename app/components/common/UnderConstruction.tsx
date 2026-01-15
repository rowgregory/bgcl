import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function UnderConstruction() {
  return (
    <div className="h-[calc(100vh-68px)] w-full flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <div className="p-4 bg-indigo-500/20 rounded-full border border-indigo-500/30">
            <AlertCircle className="w-12 h-12 text-indigo-400" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-3xl font-bold text-white">Under Construction</h1>
          <p className="text-zinc-400">This page is coming soon. We're working hard to bring you something amazing.</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-2">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-full bg-indigo-600 rounded-full"
            />
          </div>
          <p className="text-xs text-zinc-500">Building something special...</p>
        </motion.div>
      </div>
    </div>
  )
}
