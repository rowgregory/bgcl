import { WEEK_OPTIONS } from '@/app/lib/constants/cit-application.constants'
import { Check } from 'lucide-react'

export function CITStep3({ data, errors, toggleWeek }) {
  return (
    <fieldset className="space-y-3 sm:space-y-4 border-0 p-0 m-0">
      <legend className="text-xs sm:text-sm font-semibold dark:text-neutral-300 text-neutral-700 mb-1">
        Which weeks are you available?
        <span className="dark:text-sky-400 text-sky-600 ml-1" aria-hidden="true">
          *
        </span>
      </legend>
      {errors.weeksAvailable && (
        <p className="text-xs dark:text-red-400 text-red-600" role="alert">
          {errors.weeksAvailable}
        </p>
      )}
      <div role="group" aria-label="Weeks available" className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {WEEK_OPTIONS.map((week) => {
          const checked = data.weeksAvailable.includes(week)
          return (
            <label
              key={week}
              className={`cursor-pointer flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg border transition-colors focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-neutral-950 ${
                checked
                  ? 'dark:bg-sky-600/15 bg-sky-50 dark:border-sky-500/60 border-sky-400'
                  : 'dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-300 dark:hover:border-neutral-700 hover:border-neutral-400'
              }`}
            >
              <input type="checkbox" checked={checked} onChange={() => toggleWeek(week)} className="sr-only peer" />
              <span
                aria-hidden="true"
                className={`w-5 h-5 shrink-0 rounded flex items-center justify-center border transition-colors ${
                  checked
                    ? 'dark:bg-sky-600 bg-sky-600 dark:border-sky-600 border-sky-600'
                    : 'dark:border-neutral-700 border-neutral-300'
                }`}
              >
                {checked && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <span className="text-sm sm:text-base dark:text-neutral-200 text-neutral-800">{week}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
