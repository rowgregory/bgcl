'use client'

import { commonLanguages, hourOptions } from '@/lib/constants/job-application.constants'
import { motion } from 'framer-motion'
import { useFormContext, Controller } from 'react-hook-form'
import type { JobApplicationFormInput } from '@/lib/validations/job-application.validation'

export function Step2PersonalInfo() {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext<JobApplicationFormInput>()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
          Personal Info
        </h3>
        <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
          Your resume will provide your work history, education, and skills. We just need a few additional details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="applicant-name"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Full Name{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="applicant-name"
            type="text"
            {...register('applicantName')}
            aria-required="true"
            aria-invalid={!!errors.applicantName}
            aria-describedby={errors.applicantName ? 'applicant-name-error' : undefined}
            autoComplete="name"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="John Doe"
          />
          {errors.applicantName && (
            <p id="applicant-name-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.applicantName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="applicant-email"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Email{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="applicant-email"
            type="email"
            {...register('email')}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'applicant-email-error' : undefined}
            autoComplete="email"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p id="applicant-email-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label
            htmlFor="employment-type"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Employment Type{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id="employment-type"
            {...register('employmentType')}
            aria-required="true"
            aria-invalid={!!errors.employmentType}
            aria-describedby={errors.employmentType ? 'employment-type-error' : undefined}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
          >
            <option value="">Select Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
          {errors.employmentType && (
            <p id="employment-type-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.employmentType.message}
            </p>
          )}
        </div>

        {/* Hours Available */}
        <div>
          <label
            htmlFor="hours-available"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Hours Available{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id="hours-available"
            {...register('hoursAvailable')}
            aria-required="true"
            aria-invalid={!!errors.hoursAvailable}
            aria-describedby={errors.hoursAvailable ? 'hours-available-error' : undefined}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
          >
            <option value="">Select your availability</option>
            {hourOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="custom">Custom schedule</option>
          </select>
          {errors.hoursAvailable && (
            <p id="hours-available-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.hoursAvailable.message}
            </p>
          )}
        </div>
      </div>

      {/* Languages Spoken — custom control, so Controller rather than register */}
      <Controller
        control={control}
        name="languages"
        render={({ field: { value, onChange } }) => {
          const selected: string[] = Array.isArray(value) ? value : []

          const toggleLanguage = (lang: string) => {
            onChange(selected.includes(lang) ? selected.filter((l) => l !== lang) : [...selected, lang])
          }

          return (
            <div>
              <fieldset>
                <legend className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-2 sm:mb-3">
                  Languages Spoken
                </legend>

                <div
                  role="group"
                  aria-label="Select languages spoken"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2"
                >
                  {commonLanguages.map((lang) => {
                    const isSelected = selected.includes(lang)
                    return (
                      <motion.button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        aria-pressed={isSelected}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                          isSelected
                            ? 'dark:bg-sky-600 dark:border-sky-700 bg-sky-600 border-sky-700 text-white'
                            : 'dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 bg-neutral-200 border-neutral-300 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {lang}
                      </motion.button>
                    )
                  })}
                </div>
              </fieldset>

              {/* Selected Languages Display */}
              {selected.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  aria-live="polite"
                  aria-atomic="true"
                  className="mt-3 sm:mt-4 p-3 sm:p-4 dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg border"
                >
                  <p className="dark:text-neutral-300 text-neutral-700 text-xs sm:text-sm mb-1.5 sm:mb-2">
                    Selected languages:
                  </p>
                  <ul
                    role="list"
                    className="flex flex-wrap gap-1.5 sm:gap-2 list-none p-0 m-0"
                    aria-label="Selected languages"
                  >
                    {selected.map((lang) => (
                      <li
                        key={lang}
                        className="px-2.5 sm:px-3 py-1 dark:bg-sky-500/20 dark:border-sky-500/50 dark:text-sky-300 bg-sky-200 border-sky-400 text-sky-700 rounded-full text-xs sm:text-sm font-medium border"
                      >
                        <span aria-hidden="true">✓ </span>
                        {lang}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          )
        }}
      />

      {/* Suggestions */}
      <div
        role="note"
        className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-3 sm:p-4 border"
      >
        <p className="dark:text-sky-300 text-sky-700 text-xs sm:text-sm">
          <span aria-hidden="true">💡 </span>
          <span className="sr-only">Tip: </span>
          Common languages: English, Spanish, Mandarin, French, Vietnamese, Portuguese, ASL
        </p>
      </div>
    </div>
  )
}
