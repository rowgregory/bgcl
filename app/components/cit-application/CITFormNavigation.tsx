import { FORM_STEPS } from '@/app/lib/constants/cit-application.constants'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

export function CITFormNavigation({ handleBack, currentStep, handleSubmit, submitting, handleNext }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-4 sm:pt-6 border-t dark:border-neutral-800 border-neutral-200">
      <button
        type="button"
        onClick={handleBack}
        disabled={currentStep === 1}
        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg dark:text-neutral-300 text-neutral-700 dark:hover:bg-neutral-800 hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="hidden xs:inline">Back</span>
      </button>

      {currentStep < FORM_STEPS.length ? (
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
        >
          Continue
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-colors disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
        >
          {submitting ? 'Submitting…' : 'Submit Application'}
          {!submitting && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
        </button>
      )}
    </div>
  )
}
