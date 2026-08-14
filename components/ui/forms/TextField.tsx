import { TextFieldProps } from '@/types/entities/cit-application.types'

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  autoComplete,
  hint,
  error
}: TextFieldProps) {
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
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
        }
        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors ${
          error
            ? 'dark:border-red-500/60 border-red-400'
            : 'dark:border-neutral-800 border-neutral-300 dark:hover:border-neutral-700 hover:border-neutral-400'
        }`}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs dark:text-neutral-500 text-neutral-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs dark:text-red-400 text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
