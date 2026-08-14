'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Program } from '@prisma/client'

import { createContactSubmission } from '@/lib/actions/contact-submission/createContactSubmission'
import { useVolunteerDrawer } from '@/stores/drawers'
import {
  EMPTY_VOLUNTEER_SUBMISSION,
  VolunteerSubmissionFormInput,
  VolunteerSubmissionFormValues,
  volunteerSubmissionSchema
} from '@/lib/validations/contact-submission.validation'
import { AVAILABILITY_DAYS, AVAILABILITY_HOURS_OPTIONS } from '@/lib/constants/contact.constants'
import { errorBannerCls, errorCls, publicInputCls, publicLabelCls } from '@/lib/constants/form.constants'

export default function VolunteerForm({ programs }: { programs: Program[] }) {
  const router = useRouter()
  const close = useVolunteerDrawer((s) => s.close)

  const methods = useForm<VolunteerSubmissionFormInput, unknown, VolunteerSubmissionFormValues>({
    resolver: zodResolver(volunteerSubmissionSchema),
    defaultValues: EMPTY_VOLUNTEER_SUBMISSION,
    mode: 'onTouched'
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = methods

  // Primitive arrays: watch + setValue rather than useFieldArray
  const availabilityDays = watch('availabilityDays') ?? []
  const availabilityHours = watch('availabilityHours') ?? ''
  const programInterests = watch('programInterests') ?? []

  const handleDayToggle = (day: (typeof AVAILABILITY_DAYS)[number]) => {
    const next = availabilityDays.includes(day) ? availabilityDays.filter((d) => d !== day) : [...availabilityDays, day]

    setValue('availabilityDays', next, { shouldValidate: true, shouldDirty: true })
  }

  const handleProgramToggle = (program: string) => {
    const next = programInterests.includes(program)
      ? programInterests.filter((p) => p !== program)
      : [...programInterests, program]

    setValue('programInterests', next, { shouldValidate: true, shouldDirty: true })
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await createContactSubmission('VOLUNTEER', values)

      if (!res.success) {
        setError('root', { message: res.error })
        return
      }

      reset(EMPTY_VOLUNTEER_SUBMISSION)
      close()
      router.refresh()
    } catch {
      setError('root', { message: 'There was an error submitting your application. Please try again.' })
    }
  })

  const programOptions = programs.map((program) => ({
    value: program.name.toLowerCase().replace(/\s+/g, '-'),
    label: program.showAgeGroup && program.ageGroup ? `${program.name} (Ages ${program.ageGroup})` : program.name
  }))

  return (
    <div className="max-w-2xl w-full mx-auto p-6 md:p-8 ">
      {/* Header */}
      <motion.div
        className="mb-8 space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">Become a Volunteer</h1>
        <p className="dark:text-neutral-400 text-neutral-600">
          Join our team and make a difference in the lives of young people in our community.
        </p>
      </motion.div>

      <FormProvider {...methods}>
        <motion.form
          id="contactSubmissionForm"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Submission Error */}
          {errors.root && (
            <div role="alert" className={errorBannerCls}>
              {errors.root.message}
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold dark:text-white text-neutral-900">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={publicLabelCls}>
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  className={publicInputCls}
                  placeholder="John"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p role="alert" className={errorCls}>
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className={publicLabelCls}>
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  className={publicInputCls}
                  placeholder="Doe"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p role="alert" className={errorCls}>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className={publicLabelCls}>
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={publicInputCls}
                placeholder="john@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p role="alert" className={errorCls}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={publicLabelCls}>
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                className={publicInputCls}
                placeholder="9788101234"
                {...register('phone')}
              />
              {errors.phone && (
                <p role="alert" className={errorCls}>
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
            <h2 className="text-xl font-bold dark:text-white text-neutral-900">Availability</h2>

            <div>
              <p id="availabilityDaysLabel" className={`${publicLabelCls} mb-3`}>
                Which days can you volunteer? *
              </p>
              <div
                role="group"
                aria-labelledby="availabilityDaysLabel"
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
              >
                {AVAILABILITY_DAYS.map((day) => {
                  const isSelected = availabilityDays.includes(day)

                  return (
                    <motion.button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      aria-pressed={isSelected}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all border ${
                        isSelected
                          ? 'dark:bg-sky-600 dark:border-sky-500 bg-sky-600 border-sky-600 text-white'
                          : 'dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {day}
                    </motion.button>
                  )
                })}
              </div>
              {errors.availabilityDays && (
                <p role="alert" className={errorCls}>
                  {errors.availabilityDays.message}
                </p>
              )}
            </div>

            <div>
              <p id="availabilityHoursLabel" className={`${publicLabelCls} mb-3`}>
                Preferred time of day *
              </p>
              <div
                role="radiogroup"
                aria-labelledby="availabilityHoursLabel"
                className="grid grid-cols-1 lg:grid-cols-2 gap-3"
              >
                {AVAILABILITY_HOURS_OPTIONS.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                      availabilityHours === option.value
                        ? 'dark:bg-sky-600/10 dark:border-sky-500/50 bg-sky-100/50 border-sky-300'
                        : 'dark:bg-neutral-900 dark:border-neutral-700 bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="w-4 h-4 cursor-pointer"
                      {...register('availabilityHours')}
                    />
                    <span className="ml-3 dark:text-neutral-300 text-neutral-700 font-medium">{option.label}</span>
                  </motion.label>
                ))}
              </div>
              {errors.availabilityHours && (
                <p role="alert" className={errorCls}>
                  {errors.availabilityHours.message}
                </p>
              )}
            </div>
          </div>

          {/* Program Interests */}
          <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
            <h2 className="text-xl font-bold dark:text-white text-neutral-900">Program Interests *</h2>
            <p className="text-sm dark:text-neutral-400 text-neutral-600">
              Which programs are you most interested in volunteering with?
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {programOptions.map((program) => (
                <motion.label
                  key={program.value}
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                    programInterests.includes(program.value)
                      ? 'dark:bg-sky-600/10 dark:border-sky-500/50 bg-sky-100/50 border-sky-300'
                      : 'dark:bg-neutral-900 dark:border-neutral-700 bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={programInterests.includes(program.value)}
                    onChange={() => handleProgramToggle(program.value)}
                    className="w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <span className="ml-3 dark:text-neutral-300 text-neutral-700 font-medium">{program.label}</span>
                </motion.label>
              ))}
            </div>
            {errors.programInterests && (
              <p role="alert" className={errorCls}>
                {errors.programInterests.message}
              </p>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
            <h2 className="text-xl font-bold dark:text-white text-neutral-900">Additional Information</h2>

            <div>
              <label htmlFor="additionalInfo" className={publicLabelCls}>
                Tell us more about yourself
              </label>
              <textarea
                id="additionalInfo"
                rows={4}
                className={`${publicInputCls} resize-none`}
                placeholder="Share any relevant experience, skills, or why you want to volunteer..."
                {...register('additionalInfo')}
              />
            </div>
          </div>

          {/* Background Check Acknowledgment */}
          <div className="space-y-4 dark:bg-neutral-900/50 dark:border-neutral-700 bg-neutral-50 border-neutral-200 border rounded-lg p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                aria-invalid={!!errors.backgroundCheckAck}
                className="w-5 h-5 mt-1 cursor-pointer"
                {...register('backgroundCheckAck')}
              />
              <span className="dark:text-neutral-300 text-neutral-700">
                <span className="font-medium">I understand and agree *</span>
                <p className="text-sm dark:text-neutral-400 text-neutral-600 mt-1">
                  All volunteers are required to pass a background check. By submitting this application, I acknowledge
                  this requirement and consent to the process.
                </p>
              </span>
            </label>
            {errors.backgroundCheckAck && (
              <p role="alert" className={errorCls}>
                {errors.backgroundCheckAck.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-4 h-4 border-2 border-t-0 border-white animate-spin rounded-full"
                  aria-hidden="true"
                />
                Submitting...
              </div>
            ) : (
              'Submit Application'
            )}
          </motion.button>

          {/* Required Fields Note */}
          <p className="text-xs dark:text-neutral-500 text-neutral-600 text-center">
            Fields marked with * are required
          </p>
        </motion.form>
      </FormProvider>
    </div>
  )
}
