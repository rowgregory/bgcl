import { motion } from 'framer-motion'

export const NotesCard = ({ notes }: { notes?: string | null }) => {
  if (!notes) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
      className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-8 bg-neutral-50 dark:bg-neutral-800/50"
    >
      <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">Notes</h3>
      <p className="text-neutral-700 dark:text-neutral-300">{notes}</p>
    </motion.div>
  )
}
