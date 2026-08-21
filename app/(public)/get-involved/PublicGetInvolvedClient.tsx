'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, ArrowRightFromLine, AlertCircle } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useVolunteerDrawer } from '@/stores/drawers'
import {
  JobApplicationFormInput,
  jobApplicationSchema,
  STEP_FIELDS
} from '@/lib/validations/job-application.validation'
import { FORM_STEPS } from '@/lib/constants/job-application.constants'
import { Step1PositionBackground } from '@/app/(public)/get-involved/_components/Step1PositionBackground'
import { Step2PersonalInfo } from '@/app/(public)/get-involved/_components/Step2PersonalInfo'
import { Step3References } from '@/app/(public)/get-involved/_components/Step3References'
import { Step4DrivingInfo } from '@/app/(public)/get-involved/_components/Step4DrivingInfo'
import { Step5Resume } from '@/app/(public)/get-involved/_components/Step5Resume'
import { Step6Certification } from '@/app/(public)/get-involved/_components/Step6Certification'
import { createJobApplication } from '@/lib/actions/job-application/createJobApplication'
import z from 'zod'

const DEFAULT_VALUES: Partial<JobApplicationFormInput> = {
  employmentType: 'FULL_TIME',
  hoursAvailable: 'Monday-Friday 9am-5pm',
  hasValidDriverLicense: true,
  licenseSuspended: false,
  positionTypes: [],
  languages: [],
  references: [
    { name: '', positionAndCompany: '', workRelationship: '', phone: '', email: '' },
    { name: '', positionAndCompany: '', workRelationship: '', phone: '', email: '' },
    { name: '', positionAndCompany: '', workRelationship: '', phone: '', email: '' }
  ]
}

export default function PublicGetInvolvedClient({ pageData }) {
  const t = pageData?.sections?.careers
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const openVolunteerDrawer = useVolunteerDrawer((s) => s.open)

  const methods = useForm<z.input<typeof jobApplicationSchema>, unknown, z.output<typeof jobApplicationSchema>>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched'
  })

  const {
    trigger,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = methods

  const submit = handleSubmit(async (values) => {
    const result = await createJobApplication(values)

    if (!result.success || !result.jobApplicationId) {
      setError('root', { message: result.error ?? 'Something went wrong. Please try again.' })
      return
    }

    router.refresh()
    router.push(`/get-involved/${result.jobApplicationId}`)
  })

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep])
    if (!valid) return

    if (currentStep < FORM_STEPS.length) {
      setCurrentStep((s) => s + 1)
    } else {
      await submit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  // Jumping via the step indicators: back is always allowed, forward validates.
  const goToStep = async (target: number) => {
    if (target < currentStep) {
      setCurrentStep(target)
      return
    }
    if (target > currentStep) {
      const valid = await trigger(STEP_FIELDS[currentStep])
      if (valid) setCurrentStep((s) => Math.min(s + 1, target))
    }
  }

  const progress = (currentStep / FORM_STEPS.length) * 100

  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-334 mx-auto space-y-12 sm:space-y-16">
        <motion.div
          className="space-y-4 sm:space-y-6 mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
              {t?.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              {t?.heading}
            </h1>
            <div className="max-w-4xl space-y-2 sm:space-y-3">
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">{t?.paragraph1}</p>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">{t?.paragraph2}</p>
              <button
                type="button"
                onClick={() => openVolunteerDrawer()}
                className="cursor-pointer text-sm sm:text-base md:text-lg dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 transition-colors underline-offset-4 hover:underline flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
              >
                {t?.volunteer_link}
                <ArrowRightFromLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-start">
          {/* Sidebar Progress - Visible on Desktop Only */}
          <motion.nav
            aria-label="Application form steps"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex lg:col-span-1 flex-col"
          >
            <div className="sticky top-20 space-y-6">
              <div aria-live="polite" aria-atomic="true">
                <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest mb-2">
                  Progress
                </p>
                <p className="dark:text-neutral-400 text-neutral-600 text-sm">
                  Step {currentStep} of {FORM_STEPS.length}
                </p>
              </div>

              <ol className="relative list-none p-0 m-0 space-y-4" aria-label="Form steps">
                <div
                  className="absolute left-5 top-0 bottom-0 w-px dark:bg-neutral-800 bg-neutral-200"
                  aria-hidden="true"
                />

                {FORM_STEPS.map((step) => {
                  const isCompleted = step.id < currentStep
                  const isCurrent = step.id === currentStep
                  return (
                    <li key={step.id} className="relative">
                      <motion.button
                        type="button"
                        onClick={() => goToStep(step.id)}
                        aria-current={isCurrent ? 'step' : undefined}
                        aria-label={`${step.name}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                        className="relative flex items-center gap-4 group w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
                        whileHover={{ x: 4 }}
                      >
                        <div
                          aria-hidden="true"
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 relative z-10 transition-all ${
                            isCurrent
                              ? 'dark:bg-sky-600 dark:text-white bg-sky-600 text-white shadow-lg shadow-sky-600/50'
                              : isCompleted
                                ? 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-2 dark:border-emerald-500/50 bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                                : 'dark:bg-neutral-800 dark:text-neutral-400 bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            step.id
                          )}
                        </div>
                        <span className="text-xs font-semibold dark:text-neutral-400 text-neutral-600 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors hidden sm:block">
                          {step.name}
                        </span>
                      </motion.button>
                    </li>
                  )
                })}
              </ol>
            </div>
          </motion.nav>

          {/* Main Form Content */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Mobile Progress Bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden">
              <div className="mb-4 sm:mb-6 flex justify-between items-center">
                <div aria-live="polite" aria-atomic="true">
                  <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900">
                    {FORM_STEPS[currentStep - 1].name}
                  </h2>
                  <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm mt-1">
                    Step {currentStep} of {FORM_STEPS.length}
                  </p>
                </div>
              </div>

              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Application form progress: ${progress}% complete`}
                className="h-1.5 sm:h-2 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden mb-4 sm:mb-6"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-linear-to-r from-sky-500 to-sky-600 rounded-full"
                />
              </div>

              <ol className="grid grid-cols-6 gap-1.5 sm:gap-2 list-none p-0 m-0" aria-label="Form steps">
                {FORM_STEPS.map((step) => {
                  const isCompleted = step.id < currentStep
                  const isCurrent = step.id === currentStep
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => goToStep(step.id)}
                        aria-current={isCurrent ? 'step' : undefined}
                        aria-label={`${step.name}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                        className={`w-full h-8 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                          isCurrent
                            ? 'dark:bg-sky-600 dark:text-white bg-sky-600 text-white'
                            : isCompleted
                              ? 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 bg-emerald-100 text-emerald-700 border border-emerald-300'
                              : 'dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                        }`}
                      >
                        <span aria-hidden="true">{step.id}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </motion.div>

            {/* Steps — wrapped so every step can read the form via context */}
            <FormProvider {...methods}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl p-6 sm:p-8 md:p-12 space-y-4 sm:space-y-6 border"
                  role="region"
                  aria-label={`Step ${currentStep}: ${FORM_STEPS[currentStep - 1].name}`}
                  aria-live="polite"
                >
                  {currentStep === 1 && <Step1PositionBackground />}
                  {currentStep === 2 && <Step2PersonalInfo />}
                  {currentStep === 3 && <Step3References />}
                  {currentStep === 4 && <Step4DrivingInfo />}
                  {currentStep === 5 && <Step5Resume />}
                  {currentStep === 6 && <Step6Certification />}
                </motion.div>
              </AnimatePresence>
            </FormProvider>

            {/* Submit error */}
            {errors.root && (
              <div
                role="alert"
                className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">Submission failed</p>
                  <p className="text-sm text-red-700 dark:text-red-400">{errors.root.message}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between gap-3 sm:gap-4 mt-6 sm:mt-8"
            >
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                aria-disabled={currentStep === 1 || isSubmitting}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white border-neutral-300 hover:bg-neutral-100 text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white border-t-0 animate-spin"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Submitting…</span>
                  </>
                ) : (
                  <span>{currentStep === FORM_STEPS.length ? 'Submit' : 'Next'}</span>
                )}
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
