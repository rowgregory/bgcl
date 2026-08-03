'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import type { ProgramFormInput } from '@/lib/validations/program.validation'
import { inputCls, rangeCls } from '@/lib/constants/form.constants'

const DEFAULT_MIN_AGE = 5
const DEFAULT_MAX_AGE = 10

/** "5-10" → [5, 10], with sensible fallbacks for empty or malformed values. */
function parseAgeRange(value?: string | null): [number, number] {
  const [min, max] = (value ?? '').split('-').map((n) => parseInt(n, 10))
  return [Number.isNaN(min) ? DEFAULT_MIN_AGE : min, Number.isNaN(max) ? DEFAULT_MAX_AGE : max]
}

export default function ProgramDetails() {
  const {
    register,
    control,
    watch,
    formState: { errors }
  } = useFormContext<ProgramFormInput>()

  const showAgeGroup = watch('showAgeGroup')

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Program Details</h3>

      <div className="gap-4">
        {/* Age Group */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-semibold text-neutral-900 dark:text-white">Age Group</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Display age range on the program page
              </p>
            </div>
            <FormSwitch name="showAgeGroup" label="Age Group" />
          </div>

          {showAgeGroup && (
            <Controller
              control={control}
              name="ageGroup"
              render={({ field: { value, onChange } }) => {
                const [minAge, maxAge] = parseAgeRange(value)

                return (
                  <div className="p-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg">
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Age Range
                    </span>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label htmlFor="min-age" className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 block">
                          Min Age
                        </label>
                        <input
                          id="min-age"
                          type="range"
                          min={0}
                          max={18}
                          value={minAge}
                          onChange={(e) => {
                            const next = parseInt(e.target.value, 10)
                            if (next < maxAge) onChange(`${next}-${maxAge}`)
                          }}
                          aria-valuetext={`${minAge} years`}
                          className={rangeCls}
                        />
                      </div>

                      <span
                        aria-live="polite"
                        className="text-neutral-900 dark:text-white text-sm font-semibold min-w-16 text-center px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-lg"
                      >
                        {minAge}-{maxAge}
                      </span>

                      <div className="flex-1">
                        <label htmlFor="max-age" className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 block">
                          Max Age
                        </label>
                        <input
                          id="max-age"
                          type="range"
                          min={0}
                          max={18}
                          value={maxAge}
                          onChange={(e) => {
                            const next = parseInt(e.target.value, 10)
                            if (next > minAge) onChange(`${minAge}-${next}`)
                          }}
                          aria-valuetext={`${maxAge} years`}
                          className={rangeCls}
                        />
                      </div>
                    </div>
                  </div>
                )
              }}
            />
          )}
        </div>

        {/* Location */}
        <div className="col-start-1 mb-8">
          <label htmlFor="location" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            placeholder="e.g., Boys &amp; Girls Club of Lynn"
            className={inputCls}
          />
          {errors.location && (
            <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* External Link */}
        <div className="mb-8">
          <label
            htmlFor="externalLink"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            External Link
          </label>
          <input
            id="externalLink"
            type="text"
            {...register('externalLink')}
            placeholder="https://drive.google.com/file..."
            className={inputCls}
          />
          {errors.externalLink && (
            <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
              {errors.externalLink.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
