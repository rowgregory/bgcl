'use client'

import { POSITION_OPTIONS } from '@/lib/constants/job-application.constants'
import { PositionType } from '@prisma/client'
import { useFormContext, Controller } from 'react-hook-form'
import type { JobApplicationFormInput } from '@/lib/validations/job-application.validation'

export function Step1PositionBackground() {
  const {
    control,
    register,
    watch,
    formState: { errors }
  } = useFormContext<JobApplicationFormInput>()

  const youthOrgEmployment = watch('youthOrgEmployment') ?? ''
  const education = watch('education') ?? ''
  const extracurricularsSkills = watch('extracurricularsSkills') ?? ''

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
          Position &amp; Background
        </h3>
        <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
          Tell us which position(s) you are applying for and a bit about your background.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Position Types — custom toggles, so Controller */}
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
            Position(s) Applying For{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>

          <Controller
            control={control}
            name="positionTypes"
            render={({ field: { value, onChange } }) => {
              const selectedPositions: PositionType[] = Array.isArray(value) ? value : []

              const togglePosition = (position: PositionType) => {
                onChange(
                  selectedPositions.includes(position)
                    ? selectedPositions.filter((p) => p !== position)
                    : [...selectedPositions, position]
                )
              }

              return (
                <div className="flex flex-wrap gap-2 sm:gap-3" role="group" aria-label="Select positions">
                  {POSITION_OPTIONS.map(({ value: optionValue, label }) => {
                    const selected = selectedPositions.includes(optionValue as PositionType)
                    return (
                      <button
                        key={optionValue}
                        type="button"
                        onClick={() => togglePosition(optionValue as PositionType)}
                        aria-pressed={selected}
                        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          selected
                            ? 'bg-sky-500 border-sky-500 text-white'
                            : 'dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 text-neutral-900'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )
            }}
          />

          {errors.positionTypes && (
            <p role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.positionTypes.message}
            </p>
          )}
        </div>

        {/* Youth Org Employment */}
        <div className="md:col-span-2">
          <label
            htmlFor="youth-org-employment"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Youth Organization Employment{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <p className="dark:text-neutral-400 text-neutral-600 text-xs mb-2">
            Have you ever been employed by a youth serving organization? If yes, please provide dates of employment,
            location, and reason for separation.
          </p>
          <textarea
            id="youth-org-employment"
            {...register('youthOrgEmployment')}
            aria-required="true"
            aria-invalid={!!errors.youthOrgEmployment}
            aria-describedby={errors.youthOrgEmployment ? 'youth-org-error' : undefined}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
            placeholder="e.g. Camp Sunshine, June 2021 – Aug 2022, Boston MA, End of seasonal contract"
            maxLength={1000}
          />
          <p
            className={`text-xs mt-1 text-right ${
              youthOrgEmployment.length >= 900 ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {1000 - youthOrgEmployment.length} characters remaining
          </p>
          {errors.youthOrgEmployment && (
            <p id="youth-org-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.youthOrgEmployment.message}
            </p>
          )}
        </div>

        {/* Education */}
        <div className="md:col-span-2">
          <label
            htmlFor="education"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Education{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <p className="dark:text-neutral-400 text-neutral-600 text-xs mb-2">
            List your education (High School, College, Graduate). Include school name, address, years attended and
            completed.
          </p>
          <textarea
            id="education"
            {...register('education')}
            aria-required="true"
            aria-invalid={!!errors.education}
            aria-describedby={errors.education ? 'education-error' : undefined}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
            placeholder="e.g. Boston Latin School, 123 Ave Boston MA, 2015–2019, Graduated"
            maxLength={1000}
          />
          <p
            className={`text-xs mt-1 text-right ${
              education.length >= 900 ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {1000 - education.length} characters remaining
          </p>
          {errors.education && (
            <p id="education-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.education.message}
            </p>
          )}
        </div>

        {/* Extracurricular Skills */}
        <div className="md:col-span-2">
          <label
            htmlFor="extracurricular-skills"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Extracurricular Activities &amp; Special Skills
          </label>
          <p className="dark:text-neutral-400 text-neutral-600 text-xs mb-2">
            Do you participate in any extracurricular activities or have any special skills?{' '}
            <span className="italic">Ex. sports, dance, music, art</span>
          </p>
          <textarea
            id="extracurricular-skills"
            {...register('extracurricularsSkills')}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
            placeholder="e.g. Soccer coach, piano, watercolor painting"
            maxLength={1000}
          />
          <p
            className={`text-xs mt-1 text-right ${
              extracurricularsSkills.length >= 900 ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {1000 - extracurricularsSkills.length} characters remaining
          </p>
        </div>
      </div>
    </div>
  )
}
