'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, ArrowRightFromLine } from 'lucide-react'
import uploadFileToFirebase from '@/app/lib/firebase/uploadFileToFirebase'
import { store, useFormSelector } from '@/app/lib/store/store'
import { setOpenVolunteerDrawer } from '@/app/lib/store/slices/appSlice'
import { createJobApplication, CreateJobApplicationInput } from '@/app/lib/actions/createJobApplication'
import { useRouter } from 'next/navigation'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { IJobApplication } from '@/types/entities/job-application'
import { setIsLoading } from '@/app/lib/store/slices/formSlice'
import { stringifyArray } from '@/app/components/forms/VolunteerForm'

interface Step5CertificationProps {
  formData: any
  setFormData: (data: any) => void
  errors: any
}

const FORM_STEPS = [
  {
    id: 1,
    name: 'Personal Info',
    fields: ['applicantName', 'email', 'employmentType', 'hoursAvailable', 'languages']
  },
  { id: 2, name: 'References', fields: ['references'] },
  {
    id: 3,
    name: 'Driving Info',
    fields: [
      'hasValidDriverLicense',
      'licenseNumber',
      'licenseExpiration',
      'noLicenseReason',
      'licenseSuspended',
      'suspensionExplanation',
      'trafficViolations'
    ]
  },
  { id: 4, name: 'Resume', fields: ['resumeUrl'] },
  {
    id: 5,
    name: 'Certification',
    fields: ['agreeToTerms', 'certifyInformation', 'authorizeBackground', 'understandActiveStatus', 'signature']
  }
]

export default function GetInvolvedPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<IJobApplication>>({
    employmentType: 'FULL_TIME',
    hoursAvailable: 'Monday-Friday 9am-5pm',
    hasValidDriverLicense: true,
    licenseSuspended: false
  })
  const [errors, setErrors] = useState({})
  const { isLoading } = useFormSelector()

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < FORM_STEPS.length) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Personal Info
        if (!formData?.applicantName?.trim()) {
          newErrors.applicantName = 'Name is required'
        }
        if (!formData?.email?.trim()) {
          newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format'
        }
        if (!formData?.employmentType) {
          newErrors.employmentType = 'Employment type is required'
        }
        if (!formData?.hoursAvailable?.trim()) {
          newErrors.hoursAvailable = 'Hours available is required'
        }

        break

      case 2: // References
        const references = formData?.references || []
        // if (references.length < 3) {
        //   newErrors.references = '3 references are required'
        // }

        for (let index = 0; index < 3; index++) {
          const ref = references[index]

          if (!ref?.name?.trim()) {
            newErrors[`name_${index}`] = `Name is required`
          }
          if (!ref?.positionAndCompany?.trim()) {
            newErrors[`positionAndCompany_${index}`] = `Position & company is required`
          }
          if (!ref?.workRelationship?.trim()) {
            newErrors[`workRelationship_${index}`] = `Work relationship is required`
          }
          if (!ref?.phone?.trim()) {
            newErrors[`phone_${index}`] = `Phone number is required`
          } else if (!/^[\d\s\-\(\)\+]{10,}$/.test(ref.phone)) {
            newErrors[`phone_${index}`] = `Invalid phone number`
          }
          if (!ref?.email?.trim()) {
            newErrors[`email_${index}`] = `Email is required`
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref.email)) {
            newErrors[`email_${index}`] = `Invalid email format`
          }
        }
        break

      case 3: // Driving Info
        if (formData?.hasValidDriverLicense === undefined || formData?.hasValidDriverLicense === null) {
          newErrors.hasValidDriverLicense = "Please indicate if you have a valid driver's license"
        }
        if (formData?.hasValidDriverLicense === true) {
          if (!formData?.licenseNumber?.trim()) {
            newErrors.licenseNumber = 'License number is required'
          }
          if (!formData?.licenseExpiration) {
            newErrors.licenseExpiration = 'License expiration date is required'
          } else if (new Date(formData.licenseExpiration) < new Date()) {
            newErrors.licenseExpiration = 'License is expired'
          }
        }
        if (formData?.hasValidDriverLicense === false) {
          if (!formData?.noLicenseReason?.trim()) {
            newErrors.noLicenseReason = "Please explain why you don't have a license"
          }
        }
        if (formData?.licenseSuspended === true) {
          if (!formData?.suspensionExplanation?.trim()) {
            newErrors.suspensionExplanation = 'Please explain the suspension'
          }
        }
        break

      case 4: // Resume
        // Uncomment to make resume required:
        if (!formData?.resumeUrl) {
          newErrors.resumeUrl = 'Resume is required'
        }
        break

      case 5: // Certification
        if (!formData?.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms'
        }
        if (!formData?.certifyInformation) {
          newErrors.certifyInformation = 'You must certify the information is accurate'
        }
        if (!formData?.authorizeBackground) {
          newErrors.authorizeBackground = 'You must authorize the background check'
        }
        if (!formData?.understandActiveStatus) {
          newErrors.understandActiveStatus = 'You must acknowledge the active status requirement'
        }
        if (!formData?.signature?.trim()) {
          newErrors.signature = 'Signature is required'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    // Submit logic here
    const dataToSend = {
      ...formData,
      licenseExpiration: new Date(formData.licenseExpiration),
      languages: stringifyArray(formData.languages as string[])
    }
    try {
      store.dispatch(setIsLoading(true))
      const data = await createJobApplication(dataToSend as CreateJobApplicationInput)
      router.refresh()
      router.push(`/get-involved/${data.jobApplicationId}`)
      store.dispatch(showToast({ message: 'Job application submitted successfully!' }))
    } catch {
      store.dispatch(showToast({ message: 'Failed to submit job application', type: 'error' }))
    } finally {
      store.dispatch(setIsLoading(false))
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
              Opportunities
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Join Our Team
            </h1>
            <div className="max-w-4xl space-y-2 sm:space-y-3">
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
                Do you have a passion for working with children or teenagers? Do you want to make a positive impact in
                your community? If so, join our team at Boys &amp; Girls Clubs of Lynn and make a difference! At the
                Boys &amp; Girls Club of Lynn, we believe that hiring, developing and retaining skilled, passionate
                staff members is where it all begins. That's because our work is anchored in our staff's ability to
                bring our mission to life by enabling young people to realize their full potential. Our Club
                continuously looks for talented individuals interested in working with youth to join our team.
              </p>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
                The Boys &amp; Girls Clubs of Lynn is committed to a policy of equal employment opportunity and does not
                discriminate against employees or applicants for employment on the basis of any characteristic that is
                protected by law.
              </p>
              <button
                type="button"
                onClick={() => store.dispatch(setOpenVolunteerDrawer())}
                className="cursor-pointer text-sm sm:text-base md:text-lg dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 transition-colors underline-offset-4 hover:underline flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
              >
                Interested in becoming a volunteer?
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

              {/* Vertical Progress Line and Steps */}
              <ol className="relative list-none p-0 m-0 space-y-4" aria-label="Form steps">
                {/* Vertical Line Background */}
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
                        onClick={() => handleNext()}
                        aria-current={isCurrent ? 'step' : undefined}
                        aria-label={`${step.name}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                        className="relative flex items-center gap-4 group w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
                        whileHover={{ x: 4 }}
                      >
                        {/* Circle */}
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
                            /* Checkmark for completed steps */
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
                        {/* Step Name */}
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
            {/* Mobile Progress Bar - Visible only on Mobile */}
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

              {/* Progress Bar */}
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

              {/* Step Indicators Mobile */}
              <ol className="grid grid-cols-5 gap-1.5 sm:gap-2 list-none p-0 m-0" aria-label="Form steps">
                {FORM_STEPS.map((step) => {
                  const isCompleted = step.id < currentStep
                  const isCurrent = step.id === currentStep
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => handleNext()}
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

            {/* Form Content */}
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
                {currentStep === 1 && (
                  <Step1PersonalInfo formData={formData} setFormData={setFormData} errors={errors} />
                )}
                {currentStep === 2 && <Step2References formData={formData} setFormData={setFormData} errors={errors} />}
                {currentStep === 3 && (
                  <Step3DrivingInfo formData={formData} setFormData={setFormData} errors={errors} />
                )}
                {currentStep === 4 && (
                  <Step4Resume formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
                )}
                {currentStep === 5 && (
                  <Step5Certification formData={formData} setFormData={setFormData} errors={errors} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between gap-3 sm:gap-4 mt-6 sm:mt-8"
            >
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                aria-disabled={currentStep === 1}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white border-neutral-300 hover:bg-neutral-100 text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                aria-disabled={isLoading}
                aria-busy={isLoading}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white border-t-0 animate-spin"
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      {currentStep === FORM_STEPS.length ? 'Submitting…' : 'Loading next step…'}
                    </span>
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

// Step Components
function Step1PersonalInfo({ formData, setFormData, errors }: any) {
  const commonLanguages = [
    'English',
    'Spanish',
    'Mandarin',
    'French',
    'Vietnamese',
    'Portuguese',
    'Arabic',
    'ASL',
    'Cantonese',
    'Haitian Creole',
    'Italian',
    'Japanese',
    'Korean',
    'Tagalog'
  ]

  const hourOptions = [
    'Monday-Friday 9am-5pm',
    'Monday-Friday mornings (before 12pm)',
    'Monday-Friday afternoons (after 12pm)',
    'Weekends only',
    'Weekdays and weekends',
    'Flexible/As needed',
    'Summers only',
    'After school hours (3pm-6pm)',
    'Evenings (after 6pm)',
    'Custom schedule'
  ]

  const toggleLanguage = (lang: string, formData: any) => {
    const languages = formData.languages || []
    if (languages.includes(lang)) {
      setFormData({
        ...formData,
        languages: languages.filter((l: string) => l !== lang)
      })
    } else {
      setFormData({
        ...formData,
        languages: [...languages, lang]
      })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
          Personal Info
        </h3>
        <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
          Your resume will provide your work history, education, and skills. We just need a few additional details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="applicant-name"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Full Name{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="applicant-name"
            type="text"
            value={formData.applicantName || ''}
            onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.applicantName}
            aria-describedby={errors.applicantName ? 'applicant-name-error' : undefined}
            autoComplete="name"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="John Doe"
          />
          {errors.applicantName && (
            <p id="applicant-name-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.applicantName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="applicant-email"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Email{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="applicant-email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'applicant-email-error' : undefined}
            autoComplete="email"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p id="applicant-email-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label
            htmlFor="employment-type"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Employment Type{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id="employment-type"
            value={formData.employmentType || ''}
            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.employmentType}
            aria-describedby={errors.employmentType ? 'employment-type-error' : undefined}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
          >
            <option value="">Select Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
          {errors.employmentType && (
            <p id="employment-type-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.employmentType}
            </p>
          )}
        </div>

        {/* Hours Available */}
        <div>
          <label
            htmlFor="hours-available"
            className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
          >
            Hours Available{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id="hours-available"
            value={formData.hoursAvailable || ''}
            onChange={(e) => setFormData({ ...formData, hoursAvailable: e.target.value })}
            aria-required="true"
            aria-invalid={!!errors.hoursAvailable}
            aria-describedby={errors.hoursAvailable ? 'hours-available-error' : undefined}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
          >
            <option value="">Select your availability</option>
            {hourOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="custom">Custom schedule</option>
          </select>
          {errors.hoursAvailable && (
            <p id="hours-available-error" role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.hoursAvailable}
            </p>
          )}
        </div>
      </div>

      {/* Languages Spoken */}
      <div>
        <fieldset>
          <legend className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-2 sm:mb-3">
            Languages Spoken
          </legend>

          {/* Language Toggle Buttons Grid */}
          <div
            role="group"
            aria-label="Select languages spoken"
            className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2"
          >
            {commonLanguages.map((lang) => {
              const isSelected = formData.languages?.includes(lang)
              return (
                <motion.button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang, formData)}
                  aria-pressed={isSelected}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'dark:bg-sky-600 dark:border-sky-700 bg-sky-600 border-sky-700 text-white'
                      : 'dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 bg-neutral-200 border-neutral-300 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {lang}
                </motion.button>
              )
            })}
          </div>
        </fieldset>

        {/* Selected Languages Display */}
        {formData.languages && formData.languages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            aria-atomic="true"
            className="mt-3 sm:mt-4 p-3 sm:p-4 dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg border"
          >
            <p className="dark:text-neutral-300 text-neutral-700 text-xs sm:text-sm mb-1.5 sm:mb-2">
              Selected languages:
            </p>
            <ul
              role="list"
              className="flex flex-wrap gap-1.5 sm:gap-2 list-none p-0 m-0"
              aria-label="Selected languages"
            >
              {formData.languages.map((lang: string) => (
                <li
                  key={lang}
                  className="px-2.5 sm:px-3 py-1 dark:bg-sky-500/20 dark:border-sky-500/50 dark:text-sky-300 bg-sky-200 border-sky-400 text-sky-700 rounded-full text-xs sm:text-sm font-medium border"
                >
                  <span aria-hidden="true">✓ </span>
                  {lang}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      <div
        role="note"
        className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-3 sm:p-4 border"
      >
        <p className="dark:text-sky-300 text-sky-700 text-xs sm:text-sm">
          <span aria-hidden="true">💡 </span>
          <span className="sr-only">Tip: </span>
          Common languages: English, Spanish, Mandarin, French, Vietnamese, Portuguese, ASL
        </p>
      </div>
    </div>
  )
}

function Step2References({ formData, setFormData, errors }: any) {
  const updateReference = (index: number, field: string, value: any) => {
    const updatedReferemce = [...(formData.references || [])]
    if (!updatedReferemce[index]) {
      updatedReferemce[index] = {}
    }
    updatedReferemce[index][field] = value
    setFormData({ ...formData, references: updatedReferemce })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
          References
        </h3>
        <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
          Please list the names of 3 work related references we may contact. Individuals with no prior work experience
          may list volunteer-related or school references such as teachers, coaches, counselors.
        </p>
      </div>

      {/* References */}
      <ol className="space-y-4 sm:space-y-6 list-none p-0 m-0" aria-label="Reference entries">
        {[0, 1, 2].map((index) => {
          const refNum = index + 1
          const nameId = `ref-${index}-name`
          const positionId = `ref-${index}-position`
          const relationshipId = `ref-${index}-relationship`
          const phoneId = `ref-${index}-phone`
          const emailId = `ref-${index}-email`

          return (
            <li key={index}>
              <motion.fieldset
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="dark:border-neutral-700 dark:bg-neutral-900/30 border-neutral-300 bg-neutral-100/30 border rounded-lg p-4 sm:p-6 transition-all border-dashed"
              >
                <legend className="text-sm sm:text-base font-bold dark:text-white text-neutral-900 px-1">
                  Reference {refNum}
                </legend>

                <div className="space-y-4 sm:space-y-6 mt-3">
                  {/* Reference Name */}
                  <div>
                    <label
                      htmlFor={nameId}
                      className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                    >
                      Name{' '}
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      id={nameId}
                      type="text"
                      value={formData.references?.[index]?.name || ''}
                      onChange={(e) => updateReference(index, 'name', e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors[`name_${index}`]}
                      aria-describedby={errors[`name_${index}`] ? `${nameId}-error` : undefined}
                      autoComplete="off"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                      placeholder="John Smith"
                    />
                    {errors[`name_${index}`] && (
                      <p id={`${nameId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors[`name_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Position & Company */}
                  <div>
                    <label
                      htmlFor={positionId}
                      className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                    >
                      Position &amp; Company{' '}
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      id={positionId}
                      type="text"
                      value={formData.references?.[index]?.positionAndCompany || ''}
                      onChange={(e) => updateReference(index, 'positionAndCompany', e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors[`positionAndCompany_${index}`]}
                      aria-describedby={errors[`positionAndCompany_${index}`] ? `${positionId}-error` : undefined}
                      autoComplete="off"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                      placeholder="Manager at Tech Company Inc."
                    />
                    {errors[`positionAndCompany_${index}`] && (
                      <p id={`${positionId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors[`positionAndCompany_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Work Relationship */}
                  <div>
                    <label
                      htmlFor={relationshipId}
                      className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                    >
                      Work Relationship{' '}
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <textarea
                      id={relationshipId}
                      value={formData.references?.[index]?.workRelationship || ''}
                      onChange={(e) => updateReference(index, 'workRelationship', e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors[`workRelationship_${index}`]}
                      aria-describedby={errors[`workRelationship_${index}`] ? `${relationshipId}-error` : undefined}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-24 transition-colors resize-none"
                      placeholder="Senior Software Engineer - Led team of 5, managed product roadmap, improved performance by 40%"
                    />
                    {errors[`workRelationship_${index}`] && (
                      <p id={`${relationshipId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors[`workRelationship_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        htmlFor={phoneId}
                        className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                      >
                        Phone Number{' '}
                        <span aria-hidden="true" className="text-red-500">
                          *
                        </span>
                        <span className="sr-only">(required)</span>
                      </label>
                      <input
                        id={phoneId}
                        type="tel"
                        value={formData.references?.[index]?.phone || ''}
                        onChange={(e) => updateReference(index, 'phone', e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors[`phone_${index}`]}
                        aria-describedby={errors[`phone_${index}`] ? `${phoneId}-error` : undefined}
                        autoComplete="off"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="(781) 593-1772"
                      />
                      {errors[`phone_${index}`] && (
                        <p id={`${phoneId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                          {errors[`phone_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={emailId}
                        className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2"
                      >
                        Email{' '}
                        <span aria-hidden="true" className="text-red-500">
                          *
                        </span>
                        <span className="sr-only">(required)</span>
                      </label>
                      <input
                        id={emailId}
                        type="email"
                        value={formData.references?.[index]?.email || ''}
                        onChange={(e) => updateReference(index, 'email', e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors[`email_${index}`]}
                        aria-describedby={errors[`email_${index}`] ? `${emailId}-error` : undefined}
                        autoComplete="off"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="reference@example.com"
                      />
                      {errors[`email_${index}`] && (
                        <p id={`${emailId}-error`} role="alert" className="text-red-500 text-xs sm:text-sm mt-1">
                          {errors[`email_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.fieldset>
            </li>
          )
        })}
      </ol>

      {/* Info Box */}
      <div
        role="note"
        className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-3 sm:p-4 border"
      >
        <p className="dark:text-sky-300 text-sky-700 text-xs sm:text-sm">
          <span aria-hidden="true">💡 </span>
          <span className="sr-only">Tip: </span>
          If you do not have three work-related references, you may list volunteer or school references such as
          teachers, coaches, or counselors.
        </p>
      </div>
    </div>
  )
}

function Step3DrivingInfo({ formData, setFormData, errors }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-2">Driving Info</h3>
        <p className="dark:text-neutral-400 text-neutral-600 text-sm">
          This information helps us ensure safe transportation for the youth we serve.
        </p>
      </div>

      {/* Valid Driver's License */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold dark:text-white text-neutral-900">
          Do you have a valid driver's license?{' '}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
          <span className="sr-only">(required)</span>
        </legend>
        <div className="space-y-3 mt-2">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="hasValidDriverLicense"
              checked={formData.hasValidDriverLicense === false}
              onChange={() => setFormData({ ...formData, hasValidDriverLicense: false })}
              aria-describedby={errors.hasValidDriverLicense ? 'license-group-error' : undefined}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              No
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="hasValidDriverLicense"
              checked={formData.hasValidDriverLicense === true}
              onChange={() => setFormData({ ...formData, hasValidDriverLicense: true })}
              aria-describedby={errors.hasValidDriverLicense ? 'license-group-error' : undefined}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              Yes
            </span>
          </label>
        </div>
      </fieldset>

      {/* Conditional Fields Based on License Status */}
      <AnimatePresence mode="wait">
        {formData.hasValidDriverLicense ? (
          <motion.div
            key="license-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col md:flex-row items-start gap-y-6 md:gap-x-6"
            role="group"
            aria-label="License details"
          >
            <div className="flex flex-col w-full">
              <label
                htmlFor="license-number"
                className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
              >
                License Number{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="license-number"
                type="text"
                value={formData.licenseNumber || ''}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                aria-required="true"
                aria-invalid={!!errors.licenseNumber}
                aria-describedby={errors.licenseNumber ? 'license-number-error' : undefined}
                autoComplete="off"
                className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                placeholder="12345678"
              />
              {errors.licenseNumber && (
                <p id="license-number-error" role="alert" className="text-red-500 text-sm mt-1">
                  {errors.licenseNumber}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="license-expiration"
                className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
              >
                License Expiration{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="license-expiration"
                type="date"
                value={formData.licenseExpiration || ''}
                onChange={(e) => setFormData({ ...formData, licenseExpiration: e.target.value })}
                aria-required="true"
                aria-invalid={!!errors.licenseExpiration}
                aria-describedby={errors.licenseExpiration ? 'license-expiration-error' : undefined}
                className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              />
              {errors.licenseExpiration && (
                <p id="license-expiration-error" role="alert" className="text-red-500 text-sm mt-1">
                  {errors.licenseExpiration}
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-license"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
          >
            <label
              htmlFor="no-license-reason"
              className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
            >
              Reason for not having a license{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="no-license-reason"
              type="text"
              value={formData.noLicenseReason || ''}
              onChange={(e) => setFormData({ ...formData, noLicenseReason: e.target.value })}
              aria-required="true"
              aria-invalid={!!errors.noLicenseReason}
              aria-describedby={errors.noLicenseReason ? 'no-license-reason-error' : undefined}
              className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              placeholder="Please explain..."
            />
            {errors.noLicenseReason && (
              <p id="no-license-reason-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.noLicenseReason}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* License Suspension */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold dark:text-white text-neutral-900">
          Has your license ever been suspended or revoked?{' '}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
          <span className="sr-only">(required)</span>
        </legend>
        <div className="space-y-3 mt-2">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="licenseSuspended"
              checked={formData.licenseSuspended === false}
              onChange={() => setFormData({ ...formData, licenseSuspended: false })}
              aria-describedby={errors.licenseSuspended ? 'suspension-group-error' : undefined}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              No
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="licenseSuspended"
              checked={formData.licenseSuspended === true}
              onChange={() => setFormData({ ...formData, licenseSuspended: true })}
              aria-describedby={errors.licenseSuspended ? 'suspension-group-error' : undefined}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              Yes
            </span>
          </label>
        </div>
      </fieldset>

      {/* Suspension Explanation */}
      <AnimatePresence>
        {formData.licenseSuspended && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
            role="group"
            aria-label="Suspension details"
          >
            <label
              htmlFor="suspension-explanation"
              className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
            >
              Please explain the suspension or revocation.{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <textarea
              id="suspension-explanation"
              value={formData.suspensionExplanation || ''}
              onChange={(e) => setFormData({ ...formData, suspensionExplanation: e.target.value })}
              aria-required="true"
              aria-invalid={!!errors.suspensionExplanation}
              aria-describedby={errors.suspensionExplanation ? 'suspension-explanation-error' : undefined}
              className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-24 transition-colors resize-none"
              placeholder="Please explain the circumstances..."
            />
            {errors.suspensionExplanation && (
              <p id="suspension-explanation-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.suspensionExplanation}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traffic Violations */}
      <div>
        <label
          htmlFor="traffic-violations"
          className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
        >
          Please list all moving traffic violations in the last 5 years{' '}
          <span className="font-normal dark:text-neutral-400 text-neutral-600">
            (Offense, Date, Location, Comments)
          </span>{' '}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id="traffic-violations"
          value={formData.trafficViolations || ''}
          onChange={(e) => setFormData({ ...formData, trafficViolations: e.target.value })}
          aria-required="true"
          aria-invalid={!!errors.trafficViolations}
          aria-describedby={errors.trafficViolations ? 'traffic-violations-error' : 'traffic-violations-hint'}
          className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-32 transition-colors resize-none"
          placeholder="Enter offense details, dates, and locations. Enter 'None' if not applicable."
        />
        <p id="traffic-violations-hint" className="text-xs dark:text-neutral-500 text-neutral-500 mt-1">
          Include offense, date, location, and any comments. Enter "None" if not applicable.
        </p>
        {errors.trafficViolations && (
          <p id="traffic-violations-error" role="alert" className="text-red-500 text-sm mt-1">
            {errors.trafficViolations}
          </p>
        )}
      </div>
    </div>
  )
}

function Step4Resume({ formData, setFormData, errors, setErrors }: any) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf']
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, resume: 'Please upload a PDF' })
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setErrors({ ...errors, resume: 'File size must be less than 10MB' })
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)
      setErrors({ ...errors, resume: '' })

      const downloadUrl = await uploadFileToFirebase(file, (progress) => setUploadProgress(progress), 'document')

      setFormData({
        ...formData,
        resumeUrl: downloadUrl,
        resumeFileName: file.name,
        resumeFileSize: file.size,
        resumeUploadedAt: new Date().toISOString()
      })

      setUploadProgress(100)
    } catch (error) {
      setErrors({
        ...errors,
        resume: error instanceof Error ? error.message : 'Failed to upload resume'
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleUpload(files[0])
    }
  }

  const removeFile = () => {
    setFormData({
      ...formData,
      resumeUrl: null,
      resumeFileName: null,
      resumeFileSize: null,
      resumeUploadedAt: null
    })
    setErrors({ ...errors, resume: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div
        role="note"
        className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-4 border"
      >
        <p className="dark:text-sky-300 text-sky-700 text-sm">
          <span aria-hidden="true">💼 </span>
          <span className="sr-only">Note: </span>
          Upload your resume so we can review your complete work history and qualifications.
        </p>
      </div>

      {/* Upload Area */}
      {!formData.resumeUrl ? (
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            dragActive
              ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-100'
              : 'dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-neutral-600 border-neutral-300 bg-neutral-100 hover:border-neutral-400'
          }`}
          role="region"
          aria-label="Resume upload area"
        >
          {/* Visually hidden but accessible file input */}
          <label htmlFor="resume-upload" className="sr-only">
            Upload resume (PDF, DOC, or DOCX, max 10 MB)
          </label>
          <input
            id="resume-upload"
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
            aria-disabled={uploading}
            aria-describedby="resume-format-hint resume-error"
            className="sr-only"
          />

          {/* Clickable / droppable zone — triggers file input */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-disabled={uploading}
            aria-controls="resume-upload"
            className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-lg disabled:cursor-not-allowed"
          >
            <div className="space-y-3 pointer-events-none">
              <div className="text-4xl" aria-hidden="true">
                📄
              </div>
              <p className="dark:text-white text-neutral-900 font-semibold">
                {uploading ? 'Uploading…' : 'Drop your resume here or click to browse'}
              </p>
              <p id="resume-format-hint" className="dark:text-neutral-400 text-neutral-600 text-sm">
                Supported formats: PDF, DOC, DOCX. Maximum file size: 10 MB.
              </p>
            </div>
          </button>

          {/* Upload Progress */}
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 space-y-2"
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                role="progressbar"
                aria-valuenow={Math.round(uploadProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Upload progress: ${Math.round(uploadProgress)}%`}
                className="h-2 dark:bg-neutral-700 bg-neutral-300 rounded-full overflow-hidden"
              >
                <motion.div
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-linear-to-r from-sky-500 to-sky-600 rounded-full"
                />
              </div>
              <p className="dark:text-sky-400 text-sky-600 text-sm font-medium" aria-hidden="true">
                {Math.round(uploadProgress)}%
              </p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        /* Uploaded File Display */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          role="region"
          aria-label="Uploaded resume"
          aria-live="polite"
          className="dark:bg-emerald-500/10 dark:border-emerald-500/30 bg-emerald-100 border-emerald-300 rounded-lg p-6 space-y-4 border"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div aria-hidden="true" className="text-2xl">
                ✓
              </div>
              <div>
                <p className="dark:text-white text-neutral-900 font-semibold">
                  <span className="sr-only">Status: </span>Resume uploaded successfully
                </p>
                <p className="dark:text-emerald-400 text-emerald-700 text-sm mt-1">
                  <span className="sr-only">File name: </span>
                  {formData.resumeFileName}
                </p>
                <p className="dark:text-neutral-400 text-neutral-600 text-xs mt-1">
                  <span className="sr-only">File size: </span>
                  {(formData.resumeFileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              aria-label={`Remove ${formData.resumeFileName}`}
              className="dark:text-red-400 dark:hover:text-red-300 text-red-600 hover:text-red-700 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded"
            >
              Remove
            </button>
          </div>

          {/* View Link */}
          <a
            href={formData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${formData.resumeFileName} (opens in new tab)`}
            className="inline-flex items-center gap-2 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
          >
            View Resume
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </motion.div>
      )}

      {/* Error Message */}
      {errors.resume && (
        <motion.div
          id="resume-error"
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 dark:bg-red-500/10 dark:border-red-500/30 bg-red-100 border-red-300 rounded-lg dark:text-red-400 text-red-700 text-sm border"
        >
          {errors.resume}
        </motion.div>
      )}

      {/* Required Info Box */}
      <div
        role="note"
        className="dark:bg-neutral-800 dark:border-neutral-700 bg-neutral-200 border-neutral-300 rounded-lg p-4 border"
      >
        <p className="dark:text-neutral-300 text-neutral-700 text-sm">
          <span aria-hidden="true">📌 </span>
          <strong>Required:</strong> Your resume is essential for us to review your qualifications and complete your
          application.
        </p>
      </div>
    </div>
  )
}

function Step5Certification({ formData, setFormData, errors }: Step5CertificationProps) {
  const [signatureInput, setSignatureInput] = useState(formData.signature || '')

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignatureInput(e.target.value)
    setFormData({ ...formData, signature: e.target.value })
  }

  const certificationText = [
    {
      title: 'Equal Opportunity Employer',
      content:
        'The Boys & Girls Club of Lynn is an equal opportunity employer. Applicants are considered for positions without regard to veteran status, uniformed service member status, race, color, religion, sex, national origin, age, physical or mental disability, genetic information or any other category protected by applicable federal, state, or local laws.'
    },
    {
      title: 'Information Accuracy',
      content:
        'I certify that all the information on this application, my resume, or any supporting documents I may present during any interview is and will be complete and accurate to the best of my knowledge. I understand that any falsification, misrepresentation, or omission of any information may result in disqualification from consideration for employment or, if employed, disciplinary action, up to and including immediate dismissal.'
    },
    {
      title: 'At-Will Employment',
      content:
        'THE BOYS & GIRLS CLUB OF LYNN IS AN AT-WILL EMPLOYER AS ALLOWED BY APPLICABLE STATE LAW. THIS MEANS THAT REGARDLESS OF ANY PROVISION IN THIS APPLICATION, IF HIRED, THE BOYS & GIRLS CLUB OF LYNN OR I MAY TERMINATE THE EMPLOYMENT RELATIONSHIP AT ANY TIME, FOR ANY REASON, WITH OR WITHOUT CAUSE OR NOTICE. NOTHING IN THIS APPLICATION OR IN ANY DOCUMENT OR STATEMENT, WRITTEN OR ORAL, SHALL LIMIT THE RIGHT TO TERMINATE EMPLOYMENT AT-WILL. NO OFFICER, EMPLOYEE OR REPRESENTATIVE OF THE BOYS & GIRLS CLUB OF LYNN IS AUTHORIZED TO ENTER INTO AN AGREEMENT-EXPRESS OR IMPLIED-WITH ME OR ANY APPLICANT FOR EMPLOYMENT FOR A SPECIFIED PERIOD OF TIME UNLESS SUCH AN AGREEMENT IS IN A WRITTEN CONTRACT SIGNED BY THE PRESIDENT OF THE BOYS & GIRLS CLUB OF LYNN. IF HIRED, I AGREE TO CONFORM TO THE RULES AND REGULATIONS OF THE BOYS & GIRLS CLUB OF LYNN, AND I UNDERSTAND THAT THE BOYS & GIRLS CLUB OF LYNN HAS COMPLETE DISCRETION TO MODIFY SUCH RULES AND REGULATIONS AT ANY TIME, EXCEPT THAT IT WILL NOT MODIFY THIS POLICY OF EMPLOYMENT AT-WILL.'
    },
    {
      title: 'Background Investigation Authorization',
      content:
        'I authorize the Boys & Girls Club of Lynn or its agents to confirm all statements contained in this application and/or resume as it relates to the position, I am seeking to the extent permitted by federal, state, or local law. I agree to complete any requisite authorization forms for the background investigation which may be permitted by federal, state and/or local law.'
    },
    {
      title: 'Legal Work Authorization',
      content:
        'If hired by the Boys & Girls Club of Lynn, I understand that I will be required to provide genuine documentation establishing my identity and eligibility to be legally employed in the United States by the Boys & Girls Club of Lynn. I also understand that the Boys & Girls Club of Lynn employs only individuals who are legally eligible to work in the United States.'
    },
    {
      title: 'Active Application Status',
      content:
        'THIS APPLICATION WILL BE CONSIDERED ACTIVE FOR A MAXIMUM OF NINETY (90) DAYS. IF YOU WISH TO BE CONSIDERED FOR EMPLOYMENT AFTER THAT TIME, YOU MUST REAPPLY.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Certification Text */}
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
          {/* Certification Checkbox */}
          <div className="flex items-start gap-3">
            <input
              id="certify-information"
              type="checkbox"
              checked={formData.certifyInformation || false}
              onChange={(e) => setFormData({ ...formData, certifyInformation: e.target.checked })}
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
              {errors.certifyInformation}
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
            value={signatureInput}
            onChange={handleSignatureChange}
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
              {errors.signature}
            </p>
          )}
        </div>
      </motion.div>

      {/* Agreements Checkboxes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg p-6 border"
      >
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold dark:text-white text-neutral-900 mb-4">Required Agreements</legend>

          {/* Agree to Terms */}
          <div className="flex items-start gap-3">
            <input
              id="agree-to-terms"
              type="checkbox"
              checked={formData.agreeToTerms || false}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
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
              {errors.agreeToTerms}
            </p>
          )}

          {/* Authorize Background Check */}
          <div className="flex items-start gap-3">
            <input
              id="authorize-background"
              type="checkbox"
              checked={formData.authorizeBackground || false}
              onChange={(e) => setFormData({ ...formData, authorizeBackground: e.target.checked })}
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
              {errors.authorizeBackground}
            </p>
          )}

          {/* Understand Active Status */}
          <div className="flex items-start gap-3">
            <input
              id="understand-active-status"
              type="checkbox"
              checked={formData.understandActiveStatus || false}
              onChange={(e) => setFormData({ ...formData, understandActiveStatus: e.target.checked })}
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
              {errors.understandActiveStatus}
            </p>
          )}
        </fieldset>
      </motion.div>
    </div>
  )
}
