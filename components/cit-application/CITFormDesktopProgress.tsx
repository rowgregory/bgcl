import { FORM_STEPS } from '@/lib/constants/cit-application.constants'
import { motion } from 'framer-motion'

export function CITFormDesktopProgress({
  currentStep,
  goToStep
}: {
  currentStep: number
  goToStep: (step: number) => void
}) {
  return (
    <motion.nav
      aria-label="Application form steps"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden lg:flex lg:col-span-1 flex-col"
    >
      <div className="sticky top-20 space-y-6">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest mb-2">
            Progress
          </p>
          <p className="dark:text-neutral-400 text-neutral-600 text-sm">
            Step {currentStep} of {FORM_STEPS.length}
          </p>
        </div>

        <ol className="relative list-none p-0 m-0 space-y-4" aria-label="Form steps">
          <div className="absolute left-5 top-0 bottom-0 w-px dark:bg-neutral-800 bg-neutral-200" aria-hidden="true" />
          {FORM_STEPS.map((step) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            return (
              <li key={step.id} className="relative">
                <motion.button
                  type="button"
                  onClick={() => goToStep(step.id)}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${step.name}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                  className="relative flex items-center gap-4 group w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
                  whileHover={{ x: 4 }}
                >
                  <div
                    aria-hidden="true"
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 relative z-10 transition-all ${
                      isCurrent
                        ? 'dark:bg-sky-600 dark:text-white bg-sky-600 text-white shadow-lg shadow-sky-600/50'
                        : isCompleted
                          ? 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-2 dark:border-emerald-500/50 bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                          : 'dark:bg-neutral-800 dark:text-neutral-400 bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs font-semibold dark:text-neutral-400 text-neutral-600 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors hidden sm:block">
                    {step.name}
                  </span>
                </motion.button>
              </li>
            )
          })}
        </ol>
      </div>
    </motion.nav>
  )
}
