'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Calendar } from 'lucide-react'
import { MONTHS, YEARS, type NewsletterFormInput } from '@/lib/validations/newsletter.validation'
import { useFormContext, Controller } from 'react-hook-form'
import { useNewsletterDrawer } from '@/stores/drawers'

export default function NewsletterForm({ isUpdating }: { isUpdating: boolean }) {
  const {
    control,
    register,
    formState: { errors, isSubmitting }
  } = useFormContext<NewsletterFormInput>()

  const close = useNewsletterDrawer((s) => s.close)

  const optionCls = (isSelected: boolean) =>
    `px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
      isSelected
        ? 'bg-sky-600 text-white shadow-lg'
        : 'bg-white dark:bg-neutral-800 dark:text-neutral-300 text-neutral-700 border border-neutral-200 dark:border-neutral-700 hover:border-sky-500 dark:hover:border-sky-500'
    }`

  return (
    <div className="max-w-2xl w-full mx-auto p-6 md:p-8 pb-40">
      {/* Header */}
      <motion.div
        className="mb-8 space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">
          {isUpdating ? 'Edit Newsletter' : 'Create Newsletter'}
        </h1>
        <p className="dark:text-neutral-400 text-neutral-600">Upload a new newsletter PDF</p>
      </motion.div>

      {errors.root && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />
          <p className="text-sm text-red-800 dark:text-red-300">{errors.root.message}</p>
        </div>
      )}

      {/* Form fields */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          {/* Month */}
          <div>
            <span className="flex text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-3 items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Month{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </span>

            <Controller
              control={control}
              name="month"
              render={({ field: { value, onChange } }) => (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2" role="radiogroup" aria-label="Month">
                  {MONTHS.map((month) => (
                    <button
                      key={month}
                      type="button"
                      role="radio"
                      aria-checked={value === month}
                      aria-label={month}
                      onClick={() => onChange(month)}
                      className={optionCls(value === month)}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            />

            {errors.month && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.month.message}
              </p>
            )}
          </div>

          {/* Year */}
          <div>
            <span className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-3">
              Year{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </span>

            <Controller
              control={control}
              name="year"
              render={({ field: { value, onChange } }) => (
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2" role="radiogroup" aria-label="Year">
                  {YEARS.map((year) => (
                    <button
                      key={year}
                      type="button"
                      role="radio"
                      aria-checked={Number(value) === year}
                      onClick={() => onChange(year)}
                      className={optionCls(Number(value) === year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            />

            {errors.year && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.year.message}
              </p>
            )}
          </div>
        </div>

        {/* PDF URL */}
        <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
          <div>
            <label htmlFor="pdfUrl" className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              PDF URL{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="pdfUrl"
              type="url"
              {...register('pdfUrl')}
              aria-invalid={!!errors.pdfUrl}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder="https://drive.google.com/..."
            />
            {errors.pdfUrl && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.pdfUrl.message}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs dark:text-neutral-500 text-neutral-600 text-center">Fields marked with * are required</p>
      </motion.div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-6 md:p-8 z-40">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <motion.button
            type="button"
            onClick={close}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:flex-1 py-3 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:disabled:bg-neutral-800 bg-neutral-300 hover:bg-neutral-400 disabled:bg-neutral-200 text-neutral-900 dark:text-neutral-100 font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            form="newsletterForm"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:flex-1 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isUpdating ? 'Update Newsletter' : 'Create Newsletter'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
