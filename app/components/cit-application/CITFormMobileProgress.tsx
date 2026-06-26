import { FORM_STEPS } from '@/app/lib/constants/cit-application.constants'
import { motion } from 'framer-motion'

export function CITFormMobileProgress({ currentStep, progress }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden">
      <div className="mb-4 sm:mb-6 flex justify-between items-center">
        <div aria-live="polite" aria-atomic="true">
          <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900">
            {FORM_STEPS[currentStep - 1].name}
          </h2>
          <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm mt-1">
            Step {currentStep} of {FORM_STEPS.length}
          </p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Application form progress: ${progress}% complete`}
        className="h-1.5 sm:h-2 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden mb-4 sm:mb-6"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-linear-to-r from-sky-500 to-sky-600 rounded-full"
        />
      </div>
    </motion.div>
  )
}
