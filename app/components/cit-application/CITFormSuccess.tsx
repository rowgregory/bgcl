import { Check } from 'lucide-react'

export function CITFormSuccess({ data }) {
  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full dark:bg-emerald-500/20 bg-emerald-100 dark:border-2 dark:border-emerald-500/50 border-2 border-emerald-300 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 dark:text-emerald-400 text-emerald-700" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900">
          Application Submitted
        </h1>
        <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
          Thank you, {data.name.split(' ')[0] || 'applicant'}. We&apos;ve received your CIT application and will be in
          touch soon.
        </p>
      </div>
    </div>
  )
}
