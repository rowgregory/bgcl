'use client'

import { useFormContext } from 'react-hook-form'
import type { TeamMemberFormInput } from '@/lib/validations/team-member.validation'

const labelCls = 'block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2'

const fieldCls = (hasError: boolean) =>
  `w-full px-3 py-2 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-sky-500 bg-neutral-50 text-neutral-900 placeholder-neutral-500 focus:border-sky-500 border rounded-lg focus:outline-none transition-colors ${
    hasError
      ? 'dark:border-red-500 border-red-500 dark:focus:border-red-500 focus:border-red-500'
      : 'dark:border-neutral-700 border-neutral-300'
  }`

const PARAGRAPHS = [
  { name: 'paragraph1', label: 'Paragraph 1', placeholder: 'First paragraph of their story' },
  { name: 'paragraph2', label: 'Paragraph 2', placeholder: 'Second paragraph of their story' },
  { name: 'paragraph3', label: 'Paragraph 3', placeholder: 'Third paragraph of their story (optional)' }
] as const

export function YouthOfTheYear() {
  const {
    register,
    watch,
    formState: { errors, isSubmitting }
  } = useFormContext<TeamMemberFormInput>()

  if (watch('role') !== 'youth') return null

  return (
    <div className="space-y-4 dark:border-neutral-700 border-neutral-300 border-t pt-6">
      {/* Year */}
      <div>
        <label htmlFor="year" className={labelCls}>
          Year{' '}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="year"
          type="number"
          min={1900}
          max={2100}
          {...register('year')}
          aria-invalid={!!errors.year}
          placeholder={String(new Date().getFullYear())}
          className={fieldCls(!!errors.year)}
          disabled={isSubmitting}
        />
        {errors.year && (
          <p role="alert" className="text-xs text-red-500 mt-1">
            {errors.year.message}
          </p>
        )}
      </div>

      {/* Story paragraphs */}
      {PARAGRAPHS.map(({ name, label, placeholder }) => (
        <div key={name}>
          <label htmlFor={name} className={labelCls}>
            {label}
          </label>
          <textarea
            id={name}
            {...register(name)}
            aria-invalid={!!errors[name]}
            placeholder={placeholder}
            rows={4}
            className={fieldCls(!!errors[name])}
            disabled={isSubmitting}
          />
          {errors[name] && (
            <p role="alert" className="text-xs text-red-500 mt-1">
              {errors[name]?.message}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
