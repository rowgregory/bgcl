export function CheckoutStepIndicator({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="mb-10" role="list" aria-label="Checkout steps">
      <div className="flex items-center gap-4">
        {labels.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < current
          const isActive = stepNum === current

          return (
            <div key={label} className="flex items-center gap-4 flex-1 last:flex-none min-w-0" role="listitem">
              <span
                aria-current={isActive ? 'step' : undefined}
                className={`text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'font-semibold text-neutral-900 dark:text-white'
                    : isDone
                      ? 'text-neutral-500 dark:text-neutral-400'
                      : 'text-neutral-300 dark:text-neutral-700'
                }`}
              >
                {label}
              </span>

              {i < labels.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`flex-1 h-px min-w-4 transition-colors ${
                    isDone ? 'bg-neutral-300 dark:bg-neutral-700' : 'bg-neutral-200 dark:bg-neutral-800'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
