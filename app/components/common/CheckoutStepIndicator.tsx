import { Check } from 'lucide-react'

export function CheckoutStepIndicator({ current, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="mb-10" role="list" aria-label="Checkout steps">
      <div className="flex items-center gap-0">
        {labels.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < current
          const isActive = stepNum === current

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none" role="listitem">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isDone
                      ? 'border-sky-500 bg-sky-500'
                      : isActive
                        ? 'border-sky-500 dark:bg-sky-500/10 bg-sky-50'
                        : 'dark:border-neutral-700 border-neutral-200 dark:bg-neutral-800/50 bg-neutral-50'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  ) : (
                    <span
                      className={`text-[10px] font-bold tabular-nums ${
                        isActive ? 'text-sky-600 dark:text-sky-400' : 'dark:text-neutral-500 text-neutral-400'
                      }`}
                    >
                      {stepNum}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-wide uppercase whitespace-nowrap hidden sm:block transition-colors duration-200 ${
                    isDone
                      ? 'text-sky-600 dark:text-sky-400'
                      : isActive
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'dark:text-neutral-500 text-neutral-400'
                  }`}
                >
                  {label}
                </span>
              </div>

              {i < labels.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-5 sm:mb-6 rounded-full transition-all duration-300 ${
                    isDone ? 'bg-sky-500' : 'dark:bg-neutral-700 bg-neutral-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
