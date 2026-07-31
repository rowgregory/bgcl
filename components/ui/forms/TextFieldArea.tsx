import { TextAreaFieldProps } from '@/types/entities/cit-application.types'

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  required = false,
  placeholder,
  rows = 5
}: TextAreaFieldProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <label htmlFor={id} className="block text-xs sm:text-sm font-semibold dark:text-neutral-300 text-neutral-700">
        {label}
        {required && (
          <span className="dark:text-sky-400 text-sky-600 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        rows={rows}
        aria-required={required}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg dark:bg-neutral-900 bg-white dark:text-white text-neutral-900 dark:placeholder:text-neutral-600 placeholder:text-neutral-400 border dark:border-neutral-800 border-neutral-300 dark:hover:border-neutral-700 hover:border-neutral-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 resize-y min-h-[120px]"
      />
    </div>
  )
}
