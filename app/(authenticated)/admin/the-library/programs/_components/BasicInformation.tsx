import { ProgramFormInput } from '@/lib/validations/program.validation'
import { Plus, X } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export default function BasicInformation() {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<ProgramFormInput>()

  const descriptions = watch('descriptions') ?? []

  const addDescription = () => setValue('descriptions', [...descriptions, ''], { shouldDirty: true })

  const removeDescription = (index: number) =>
    setValue(
      'descriptions',
      descriptions.filter((_, i) => i !== index),
      { shouldDirty: true }
    )

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Basic Information</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Program Name{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            aria-invalid={!!errors.name}
            placeholder="Enter program name"
            className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
          {errors.name && (
            <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Additional Descriptions */}
        {descriptions.length > 0 && (
          <div className="space-y-4">
            <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Additional Descriptions
            </span>
            <div className="space-y-3">
              {descriptions.map((_, index) => (
                <div key={index} className="relative">
                  <textarea
                    {...register(`descriptions.${index}`)}
                    aria-label={`Description ${index + 1}`}
                    placeholder={`Description ${index + 1}`}
                    rows={4}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeDescription(index)}
                    aria-label={`Remove description ${index + 1}`}
                    className="absolute top-3 right-3 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                    title="Remove description"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Description Button */}
        <button
          type="button"
          onClick={addDescription}
          className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Description
        </button>
      </div>
    </div>
  )
}
