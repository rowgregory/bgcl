'use client'

import { useFormContext } from 'react-hook-form'
import type { ProgramFormInput } from '@/lib/validations/program.validation'
import { inputCls, subLabelCls } from '@/lib/constants/form.constants'

export default function PDFSection() {
  const {
    register,
    formState: { errors }
  } = useFormContext<ProgramFormInput>()

  return (
    <div className="mb-8 space-y-4">
      <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">PDF</span>

      <div className="space-y-3">
        <div>
          <label htmlFor="pdfLink" className={subLabelCls}>
            PDF Link
          </label>
          <input
            id="pdfLink"
            type="url"
            {...register('pdfLink')}
            aria-invalid={!!errors.pdfLink}
            placeholder="https://..."
            className={inputCls}
          />
          {errors.pdfLink && (
            <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
              {errors.pdfLink.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="pdfDescription" className={subLabelCls}>
            PDF Description
          </label>
          <input
            id="pdfDescription"
            type="text"
            {...register('pdfDescription')}
            aria-invalid={!!errors.pdfDescription}
            placeholder="Describe this PDF..."
            className={inputCls}
          />
          {errors.pdfDescription && (
            <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
              {errors.pdfDescription.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
