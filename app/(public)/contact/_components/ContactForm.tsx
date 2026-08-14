'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'

import { createContactSubmission } from '@/lib/actions/contact-submission/createContactSubmission'
import { CONTACT_SUBJECT_OPTIONS } from '@/lib/constants/contact.constants'
import {
  ContactSubmissionFormInput,
  ContactSubmissionFormValues,
  contactSubmissionSchema,
  EMPTY_CONTACT_SUBMISSION
} from '@/lib/validations/contact-submission.validation'
import { errorCls, publicInputCls, publicLabelCls } from '@/lib/constants/form.constants'

export default function ContactForm({ defaultSubject }: { defaultSubject?: string | null }) {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ContactSubmissionFormInput, unknown, ContactSubmissionFormValues>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: { ...EMPTY_CONTACT_SUBMISSION, subject: defaultSubject ?? '' },
    mode: 'onTouched'
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await createContactSubmission('GENERAL', values)

      if (!res.success) {
        setError('root', { message: res.error })
        return
      }

      reset(EMPTY_CONTACT_SUBMISSION)
      setIsSubmitted(true)
      router.refresh()
    } catch {
      setError('root', { message: 'There was an error sending your message. Please try again.' })
    }
  })

  if (isSubmitted) {
    return (
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 p-6 sm:p-8 md:p-12 rounded-lg sm:rounded-xl border text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full dark:bg-sky-500/10 bg-sky-100">
            <Check className="h-6 w-6 dark:text-sky-400 text-sky-600" aria-hidden="true" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900">Message sent</h3>
          <p className="mt-2 text-sm dark:text-neutral-400 text-neutral-600">
            Thanks for reaching out. Someone from our team will get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="mt-6 text-sm font-semibold dark:text-sky-400 text-sky-600 hover:underline"
          >
            Send another message
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      className="lg:col-span-2"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border">
        <div className="space-y-4 sm:space-y-6">
          {errors.root && (
            <div
              role="alert"
              className="rounded-lg border dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300 bg-red-50 border-red-200 text-red-700 px-4 py-3 text-sm"
            >
              {errors.root.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                placeholder="greg@sqysh.com"
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

          <div>
            <label htmlFor="subject" className={publicLabelCls}>
              Subject
            </label>
            <select id="subject" aria-invalid={!!errors.subject} className={publicInputCls} {...register('subject')}>
              <option value="">Select a subject</option>
              {CONTACT_SUBJECT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p role="alert" className={errorCls}>
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className={publicLabelCls}>
              Message *
            </label>
            <textarea
              id="message"
              rows={5}
              aria-invalid={!!errors.message}
              className={`${publicInputCls} resize-none`}
              placeholder="Tell us more about your inquiry..."
              {...register('message')}
            />
            {errors.message && (
              <p role="alert" className={errorCls}>
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 sm:py-4 text-sm sm:text-base dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>

          <p className="text-xs dark:text-neutral-500 text-neutral-600 text-center">
            Fields marked with * are required
          </p>
        </div>
      </div>
    </motion.form>
  )
}
