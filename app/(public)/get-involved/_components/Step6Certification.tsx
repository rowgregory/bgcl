'use client'

import { certificationText } from '@/lib/constants/job-application.constants'
import { useFormContext } from 'react-hook-form'
import { motion } from 'framer-motion'
import type { JobApplicationFormInput } from '@/lib/validations/job-application.validation'

export function Step6Certification() {
  const {
    register,
    formState: { errors }
  } = useFormContext<JobApplicationFormInput>()

  return (
    <div className="space-y-6">
      {/* Certification Text — unchanged */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        tabIndex={0}
        role="region"
        aria-label="Certification agreement text"
        aria-describedby="certification-scroll-hint"
        className="dark:bg-neutral-800 dark:border-neutral-700 bg-neutral-200 border-neutral-300 rounded-lg p-8 space-y-6 max-h-96 overflow-y-auto border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <p id="certification-scroll-hint" className="sr-only">
          Scrollable region. Use arrow keys to scroll and read the full certification text before signing below.
        </p>
        <div className="space-y-6 dark:text-neutral-300 text-neutral-700 text-sm leading-relaxed">
          {certificationText.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-semibold dark:text-white text-neutral-900">{section.title}</h3>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Signature Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg p-8 space-y-6 border"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              id="certify-information"
              type="checkbox"
              {...register('certifyInformation')}
              aria-required="true"
              aria-invalid={!!errors.certifyInformation}
              aria-describedby={errors.certifyInformation ? 'certify-information-error' : undefined}
              className="w-4 h-4 rounded dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 dark:focus:ring-sky-500 border-neutral-300 bg-white text-sky-600 focus:ring-sky-500 focus:ring-offset-2 mt-1 cursor-pointer"
            />
            <label
              htmlFor="certify-information"
              className="dark:text-white text-neutral-900 text-sm leading-relaxed cursor-pointer"
            >
              By checking this box, I acknowledge that all above information is valid and true to my knowledge. If you
              are under 18, please have your parent or guardian sign this section.{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
          </div>
          {errors.certifyInformation && (
            <p id="certify-information-error" role="alert" className="text-red-500 text-sm">
              {errors.certifyInformation.message}
            </p>
          )}
        </div>

        {/* Signature Input */}
        <div className="space-y-2">
          <label htmlFor="signature-input" className="block text-sm font-semibold dark:text-white text-neutral-900">
            Your Signature{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="signature-input"
            type="text"
            {...register('signature')}
            placeholder="Type your full name as signature"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.signature}
            aria-describedby={`signature-hint${errors.signature ? ' signature-error' : ''}`}
            className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:border-b-sky-500 dark:text-white bg-white border-neutral-300 border-b-2 rounded-none focus:outline-none focus:ring-0 focus:dark:border-b-sky-500 focus:border-b-sky-600 text-lg tracking-wide transition-colors"
          />
          <p id="signature-hint" className="dark:text-neutral-400 text-neutral-600 text-xs">
            Type your full legal name to sign this application.
          </p>
          {errors.signature && (
            <p id="signature-error" role="alert" className="text-red-500 text-sm">
              {errors.signature.message}
            </p>
          )}
        </div>
      </motion.div>

      {/* Agreements — same pattern for the remaining three checkboxes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg p-6 border"
      >
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold dark:text-white text-neutral-900 mb-4">Required Agreements</legend>

          <div className="flex items-start gap-3">
            <input
              id="agree-to-terms"
              type="checkbox"
              {...register('agreeToTerms')}
              aria-required="true"
              aria-invalid={!!errors.agreeToTerms}
              aria-describedby={errors.agreeToTerms ? 'agree-to-terms-error' : undefined}
              className="w-4 h-4 rounded dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 dark:focus:ring-sky-500 border-neutral-300 bg-white text-sky-600 focus:ring-sky-500 focus:ring-offset-2 mt-1 cursor-pointer"
            />
            <label htmlFor="agree-to-terms" className="dark:text-white text-neutral-900 text-sm cursor-pointer">
              I agree to the terms and conditions{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p id="agree-to-terms-error" role="alert" className="text-red-500 text-sm">
              {errors.agreeToTerms.message}
            </p>
          )}

          {/* Authorize Background Check */}
          <div className="flex items-start gap-3">
            <input
              id="authorize-background"
              type="checkbox"
              {...register('authorizeBackground')}
              aria-required="true"
              aria-invalid={!!errors.authorizeBackground}
              aria-describedby={errors.authorizeBackground ? 'authorize-background-error' : undefined}
              className="w-4 h-4 rounded dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 dark:focus:ring-sky-500 border-neutral-300 bg-white text-sky-600 focus:ring-sky-500 focus:ring-offset-2 mt-1 cursor-pointer"
            />
            <label htmlFor="authorize-background" className="dark:text-white text-neutral-900 text-sm cursor-pointer">
              I authorize a background check investigation{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
          </div>
          {errors.authorizeBackground && (
            <p id="authorize-background-error" role="alert" className="text-red-500 text-sm">
              {errors.authorizeBackground.message}
            </p>
          )}

          {/* Understand Active Status */}
          <div className="flex items-start gap-3">
            <input
              id="understand-active-status"
              type="checkbox"
              {...register('understandActiveStatus')}
              aria-required="true"
              aria-invalid={!!errors.understandActiveStatus}
              aria-describedby={errors.understandActiveStatus ? 'understand-active-status-error' : undefined}
              className="w-4 h-4 rounded dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 dark:focus:ring-sky-500 border-neutral-300 bg-white text-sky-600 focus:ring-sky-500 focus:ring-offset-2 mt-1 cursor-pointer"
            />
            <label
              htmlFor="understand-active-status"
              className="dark:text-white text-neutral-900 text-sm cursor-pointer"
            >
              I understand applications are active for 90 days only{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
          </div>
          {errors.understandActiveStatus && (
            <p id="understand-active-status-error" role="alert" className="text-red-500 text-sm">
              {errors.understandActiveStatus.message}
            </p>
          )}
        </fieldset>
      </motion.div>
    </div>
  )
}
