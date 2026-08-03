'use client'

import { useFormContext } from 'react-hook-form'
import type { ProgramFormInput } from '@/lib/validations/program.validation'
import { inputCls, labelCls } from '@/lib/constants/form.constants'

export function AdditionalInformation() {
  const {
    register,
    formState: { errors }
  } = useFormContext<ProgramFormInput>()

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Additional Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="datesAvailable" className={labelCls}>
            Dates Available
          </label>
          <input
            id="datesAvailable"
            type="text"
            {...register('datesAvailable')}
            placeholder="e.g., TBA or June 1 - August 31"
            className={inputCls}
          />
          {errors.datesAvailable && (
            <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
              {errors.datesAvailable.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="license" className={labelCls}>
            License Information
          </label>
          <input
            id="license"
            type="text"
            {...register('license')}
            placeholder="e.g., EEC Licensed Ages 5-10"
            className={inputCls}
          />
          {errors.license && (
            <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
              {errors.license.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
