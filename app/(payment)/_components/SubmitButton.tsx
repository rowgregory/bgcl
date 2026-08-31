'use client'

type Props = {
  label: string
  isSubmitting: boolean
  isValid?: boolean
}

export function SubmitButton({ label, isSubmitting, isValid = true }: Props) {
  const ready = isValid && !isSubmitting

  return (
    <button
      type="submit"
      disabled={!ready}
      aria-disabled={!ready}
      aria-live={isSubmitting ? 'polite' : undefined}
      className={`w-full px-5 py-4 rounded-lg text-[15px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
        ready
          ? 'bg-sky-600 hover:bg-sky-500 text-white'
          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
      }`}
    >
      {isSubmitting ? 'Processing…' : label}
    </button>
  )
}
