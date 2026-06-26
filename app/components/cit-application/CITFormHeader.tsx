import { motion } from 'framer-motion'
import { ArrowRightFromLine } from 'lucide-react'

export function CITFormHeader({ t }) {
  return (
    <motion.div
      className="space-y-4 sm:space-y-6 mb-12 sm:mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-3 sm:space-y-4">
        <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
          {t?.eyebrow ?? 'Counselor-in-Training'}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
          {t?.heading ?? 'CIT Application'}
        </h1>
        <div className="max-w-4xl space-y-2 sm:space-y-3">
          <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
            {t?.paragraph1 ??
              'Ready to grow as a leader this summer? Tell us about yourself and the weeks you can join us.'}
          </p>
          {t?.paragraph2 && (
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">{t.paragraph2}</p>
          )}
          {t?.volunteer_link && (
            <button
              type="button"
              className="cursor-pointer text-sm sm:text-base md:text-lg dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 transition-colors underline-offset-4 hover:underline flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
            >
              {t.volunteer_link}
              <ArrowRightFromLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
