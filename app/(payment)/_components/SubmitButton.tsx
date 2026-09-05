'use client'

type Props = {
  label: string
  isSubmitting: boolean
  isValid?: boolean
}

const BASE =
  'relative overflow-hidden w-full flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950 px-5 lg:px-8 py-4 sm:py-3 lg:py-4 text-xs sm:text-sm rounded-lg sm:rounded-xl'

const ACTIVE =
  'text-white bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-500/25 cursor-pointer'

const INACTIVE = 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'

export function SubmitButton({ label, isSubmitting, isValid = true }: Props) {
  const ready = isValid && !isSubmitting

  // Submitting keeps the active fill so the shimmer has something to run over
  const enabled = ready || isSubmitting

  return (
    <button
      type="submit"
      disabled={!ready}
      aria-disabled={!ready}
      aria-busy={isSubmitting}
      aria-live={isSubmitting ? 'polite' : undefined}
      className={`${BASE} ${enabled ? ACTIVE : INACTIVE} ${isSubmitting ? 'cursor-wait' : ''}`}
    >
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent shimmer" />

      <span className="relative">{isSubmitting ? 'Processing…' : label}</span>
    </button>
  )
}
