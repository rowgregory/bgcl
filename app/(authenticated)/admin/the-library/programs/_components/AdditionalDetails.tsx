'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import type { ProgramFormInput } from '@/lib/validations/program.validation'
import { detailInputCls, detailLabelCls } from '@/lib/constants/form.constants'

export function AdditionalDetails() {
  const { control, register } = useFormContext<ProgramFormInput>()

  const { fields, append, remove } = useFieldArray({ control, name: 'additionalDetails' })

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Additional Details</span>
        <button
          type="button"
          onClick={() => append({ title: '', input1: '', input2: '' })}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-sky-600 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Detail
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No additional details yet. Click &quot;Add Detail&quot; to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Detail #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  aria-label={`Remove detail ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div>
                <label htmlFor={`detail-${field.id}-title`} className={detailLabelCls}>
                  Title
                </label>
                <input
                  id={`detail-${field.id}-title`}
                  type="text"
                  {...register(`additionalDetails.${index}.title`)}
                  placeholder="e.g., Requirements, Schedule, Notes"
                  className={detailInputCls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`detail-${field.id}-input1`} className={detailLabelCls}>
                    Field 1
                  </label>
                  <input
                    id={`detail-${field.id}-input1`}
                    type="text"
                    {...register(`additionalDetails.${index}.input1`)}
                    placeholder="Enter first detail"
                    className={detailInputCls}
                  />
                </div>

                <div>
                  <label htmlFor={`detail-${field.id}-input2`} className={detailLabelCls}>
                    Field 2
                  </label>
                  <input
                    id={`detail-${field.id}-input2`}
                    type="text"
                    {...register(`additionalDetails.${index}.input2`)}
                    placeholder="Enter second detail"
                    className={detailInputCls}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
