'use client'

import { useFormContext } from 'react-hook-form'
import ImageUpload from '@/components/_shared/ImageUpload'
import {
  TEAM_MEMBER_ROLES,
  TEAM_MEMBER_ROLE_LABELS,
  type TeamMemberFormInput,
  type TeamMemberRole
} from '@/lib/validations/team-member.validation'

// Which roles show which optional fields. Positive lists read better than the
// long "not this and not that" chains they replace.
const SHOWS_TITLE: TeamMemberRole[] = ['officer', 'admin_staff', 'program_staff', 'maintenance_staff', 'honoree']
const SHOWS_COMPANY: TeamMemberRole[] = ['officer', 'director']
const SHOWS_CONTACT: TeamMemberRole[] = ['admin_staff', 'program_staff']
const SHOWS_IMAGE: TeamMemberRole[] = ['admin_staff', 'program_staff', 'youth', 'honoree']

const labelCls = 'block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2'

const fieldCls = (hasError: boolean) =>
  `w-full px-3 py-2 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-sky-500 bg-neutral-50 text-neutral-900 placeholder-neutral-500 focus:border-sky-500 border rounded-lg focus:outline-none transition-colors ${
    hasError
      ? 'dark:border-red-500 border-red-500 dark:focus:border-red-500 focus:border-red-500'
      : 'dark:border-neutral-700 border-neutral-300'
  }`

export function TeamMemberBasicInfo() {
  const {
    register,
    watch,
    formState: { errors, isSubmitting }
  } = useFormContext<TeamMemberFormInput>()

  const role = watch('role') as TeamMemberRole

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className={labelCls}>
          Name{' '}
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
          placeholder="Full name"
          className={fieldCls(!!errors.name)}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p role="alert" className="text-xs text-red-500 mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className={labelCls}>
          Role{' '}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>
        <select
          id="role"
          {...register('role')}
          aria-invalid={!!errors.role}
          className={fieldCls(!!errors.role)}
          disabled={isSubmitting}
        >
          <option value="">Select a role</option>
          {TEAM_MEMBER_ROLES.map((r) => (
            <option key={r} value={r}>
              {TEAM_MEMBER_ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        {errors.role && (
          <p role="alert" className="text-xs text-red-500 mt-1">
            {errors.role.message}
          </p>
        )}
      </div>

      {/* Title */}
      {SHOWS_TITLE.includes(role) && (
        <div>
          <label htmlFor="title" className={labelCls}>
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            aria-invalid={!!errors.title}
            placeholder="Job title or position"
            className={fieldCls(!!errors.title)}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Contact — staff only */}
      {SHOWS_CONTACT.includes(role) && (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className={labelCls}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              aria-invalid={!!errors.phone}
              placeholder="(781) 593-1772"
              className={fieldCls(!!errors.phone)}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p role="alert" className="text-xs text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelCls}>
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              aria-invalid={!!errors.email}
              placeholder="name@bgcl.org"
              className={fieldCls(!!errors.email)}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p role="alert" className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Company */}
      {SHOWS_COMPANY.includes(role) && (
        <div>
          <label htmlFor="company" className={labelCls}>
            Company
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            aria-invalid={!!errors.company}
            placeholder="Company or organization"
            className={fieldCls(!!errors.company)}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Image */}
      {SHOWS_IMAGE.includes(role) && <ImageUpload fieldName="image" label="Image" />}
    </div>
  )
}
