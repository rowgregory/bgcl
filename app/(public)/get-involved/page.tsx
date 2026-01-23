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
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
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
                your community? If so, join our team at Boys & Girls Clubs of Lynn and make a difference! At the Boys &
                Girls Club of Lynn, we believe that hiring, developing and retaining skilled, passionate staff members
                is where it all begins. That's because our work is anchored in our staff's ability to bring our mission
                to life by enabling young people to realize their full potential. Our Club continuously looks for
                talented individuals interested in working with youth to join our team.
              </p>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
                The Boys & Girls Clubs of Lynn is committed to a policy of equal employment opportunity and does not
                discriminate against employees or applicants for employment on the basis of any characteristic that is
                protected by law.
              </p>
              <button
                onClick={() => store.dispatch(setOpenVolunteerDrawer())}
                className="cursor-pointer text-sm sm:text-base md:text-lg dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 transition-colors underline-offset-4 hover:underline flex items-center gap-2"
              >
                Interested in becoming a volunteer?
                <ArrowRightFromLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-start">
          {/* Sidebar Progress - Visible on Desktop Only */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex lg:col-span-1 flex-col"
          >
            <div className="sticky top-20 space-y-6">
              <div>
                <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest mb-2">
                  Progress
                </p>
                <p className="dark:text-neutral-400 text-neutral-600 text-sm">
                  Step {currentStep} of {FORM_STEPS.length}
                </p>
              </div>

              {/* Vertical Progress Line and Steps */}
              <div className="relative">
                {/* Vertical Line Background */}
                <div className="absolute left-5 top-0 bottom-0 w-px dark:bg-neutral-800 bg-neutral-200" />

                {/* Step Circles Vertical */}
                <div className="space-y-4">
                  {FORM_STEPS.map((step) => (
                    <motion.button
                      key={step.id}
                      onClick={() => handleNext()}
                      className="relative flex items-center gap-4 group w-full"
                      whileHover={{ x: 4 }}
                    >
                      {/* Circle */}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 relative z-10 transition-all ${
                          step.id === currentStep
                            ? 'dark:bg-sky-600 dark:text-white bg-sky-600 text-white shadow-lg shadow-sky-600/50'
                            : step.id < currentStep
                              ? 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-2 dark:border-emerald-500/50 bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                              : 'dark:bg-neutral-800 dark:text-neutral-400 bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {step.id}
                      </div>
                      {/* Step Name - Appears on Hover */}
                      <span className="text-xs font-semibold dark:text-neutral-400 text-neutral-600 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors hidden sm:block">
                        {step.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Form Content */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Mobile Progress Bar - Visible only on Mobile */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden">
              <div className="mb-4 sm:mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900">
                    {FORM_STEPS[currentStep - 1].name}
                  </h2>
                  <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm mt-1">
                    Step {currentStep} of {FORM_STEPS.length}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 sm:h-2 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden mb-4 sm:mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-linear-to-r from-sky-500 to-sky-600 rounded-full"
                />
              </div>

              {/* Step Indicators Mobile */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {FORM_STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleNext()}
                    className={`h-8 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                      step.id === currentStep
                        ? 'dark:bg-sky-600 dark:text-white bg-sky-600 text-white'
                        : step.id < currentStep
                          ? 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                    }`}
                  >
                    {step.id}
                  </button>
                ))}
              </div>
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
              >
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <Step1PersonalInfo formData={formData} setFormData={setFormData} errors={errors} />
                )}

                {/* Step 2: References */}
                {currentStep === 2 && <Step2References formData={formData} setFormData={setFormData} errors={errors} />}

                {/* Step 3: Driving Info */}
                {currentStep === 3 && (
                  <Step3DrivingInfo formData={formData} setFormData={setFormData} errors={errors} />
                )}

                {/* Step 4: Resume */}
                {currentStep === 4 && (
                  <Step4Resume formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
                )}

                {/* Step 5: Certification */}
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
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white border-neutral-300 hover:bg-neutral-100 text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg transition-colors border"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors ml-auto"
              >
                <span>
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white border-t-0" />
                  ) : currentStep === FORM_STEPS.length ? (
                    'Submit'
                  ) : (
                    'Next'
                  )}
                </span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
          <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.applicantName || ''}
            onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="John Doe"
          />
          {errors.applicantName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.applicantName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.employmentType || ''}
            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-100 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
          >
            <option value="">Select Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
        </div>

        {/* Hours Available */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
            Hours Available <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.hoursAvailable || ''}
            onChange={(e) => setFormData({ ...formData, hoursAvailable: e.target.value })}
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
          {errors.hoursAvailable && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.hoursAvailable}</p>}
        </div>
      </div>

      {/* Languages Spoken */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-2 sm:mb-3">
          Languages Spoken
        </label>

        {/* Language Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {commonLanguages.map((lang) => (
            <motion.button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang, formData)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all border-2 ${
                formData.languages?.includes(lang)
                  ? 'dark:bg-sky-600 dark:border-sky-700 bg-sky-600 border-sky-700 text-white'
                  : 'dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 bg-neutral-200 border-neutral-300 text-neutral-700 hover:border-neutral-400'
              }`}
            >
              {lang}
            </motion.button>
          ))}
        </div>

        {/* Selected Languages Display */}
        {formData.languages && formData.languages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 sm:mt-4 p-3 sm:p-4 dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg border"
          >
            <p className="dark:text-neutral-300 text-neutral-700 text-xs sm:text-sm mb-1.5 sm:mb-2">
              Selected languages:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {formData.languages.map((lang: string) => (
                <span
                  key={lang}
                  className="px-2.5 sm:px-3 py-1 dark:bg-sky-500/20 dark:border-sky-500/50 dark:text-sky-300 bg-sky-200 border-sky-400 text-sky-700 rounded-full text-xs sm:text-sm font-medium border"
                >
                  ✓ {lang}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      <div className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-3 sm:p-4 border">
        <p className="dark:text-sky-300 text-sky-700 text-xs sm:text-sm">
          💡 Common languages: English, Spanish, Mandarin, French, Vietnamese, Portuguese, ASL
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
      <div className="space-y-4 sm:space-y-6">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`dark:border-neutral-700 dark:bg-neutral-900/30 border-neutral-300 bg-neutral-100/30 border rounded-lg p-4 sm:p-6 transition-all border-dashed`}
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Reference Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.references?.[index]?.name || ''}
                  onChange={(e) => updateReference(index, 'name', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  placeholder="John Smith"
                />
                {errors[`name_${index}`] && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[`name_${index}`]}</p>
                )}
              </div>

              {/* Position & Company */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                  Position & Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.references?.[index]?.positionAndCompany || ''}
                  onChange={(e) => updateReference(index, 'positionAndCompany', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  placeholder="Manager at Tech Company Inc."
                />
                {errors[`positionAndCompany_${index}`] && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[`positionAndCompany_${index}`]}</p>
                )}
              </div>

              {/* Work Relationship */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                  Work Relationship <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.references?.[index]?.workRelationship || ''}
                  onChange={(e) => updateReference(index, 'workRelationship', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-24 transition-colors resize-none"
                  placeholder="Senior Software Engineer - Led team of 5, managed product roadmap, improved performance by 40%"
                />
                {errors[`workRelationship_${index}`] && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[`workRelationship_${index}`]}</p>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.references?.[index]?.phone || ''}
                    onChange={(e) => updateReference(index, 'phone', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                    placeholder="7815931772"
                  />
                  {errors[`phone_${index}`] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[`phone_${index}`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.references?.[index]?.email || ''}
                    onChange={(e) => updateReference(index, 'email', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base dark:bg-neutral-700 dark:border-neutral-600 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                    placeholder="reference@example.com"
                  />
                  {errors[`email_${index}`] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[`email_${index}`]}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <div className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-3 sm:p-4 border">
        <p className="dark:text-sky-300 text-sky-700 text-xs sm:text-sm">
          💡 If you do not have three work-related references, you may list volunteer or school references such as
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
      <div className="space-y-3">
        <label className="block text-sm font-semibold dark:text-white text-neutral-900">
          Do you have a valid drivers license? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              checked={formData.hasValidDriverLicense === false}
              onChange={(e) => setFormData({ ...formData, hasValidDriverLicense: false })}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              No
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              checked={formData.hasValidDriverLicense === true}
              onChange={(e) => setFormData({ ...formData, hasValidDriverLicense: true })}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              Yes
            </span>
          </label>
        </div>
      </div>

      {/* Conditional Fields Based on License Status */}
      <AnimatePresence mode="wait">
        {formData.hasValidDriverLicense ? (
          <motion.div
            key="license-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col md:flex-row items-center gap-y-6 md:gap-x-6"
          >
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.licenseNumber || ''}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                placeholder="12345678"
              />
              {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
            </div>
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
                License Expiration <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.licenseExpiration || ''}
                onChange={(e) => setFormData({ ...formData, licenseExpiration: e.target.value })}
                className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              />
              {errors.licenseExpiration && <p className="text-red-500 text-sm mt-1">{errors.licenseExpiration}</p>}
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
            <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
              Reason for not having a license <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.noLicenseReason || ''}
              onChange={(e) => setFormData({ ...formData, noLicenseReason: e.target.value })}
              className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              placeholder="Please explain..."
            />
            {errors.noLicenseReason && <p className="text-red-500 text-sm mt-1">{errors.noLicenseReason}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* License Suspension */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold dark:text-white text-neutral-900">
          Has your license ever been suspended or revoked? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              checked={formData.licenseSuspended === false}
              onChange={(e) => setFormData({ ...formData, licenseSuspended: false })}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              No
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              checked={formData.licenseSuspended === true}
              onChange={(e) => setFormData({ ...formData, licenseSuspended: true })}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              Yes
            </span>
          </label>
        </div>
      </div>

      {/* Suspension Explanation */}
      <AnimatePresence>
        {formData.licenseSuspended && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
          >
            <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
              Please explain. <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.suspensionExplanation || ''}
              onChange={(e) => setFormData({ ...formData, suspensionExplanation: e.target.value })}
              className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-24 transition-colors"
              placeholder="Please explain the circumstances..."
            />
            {errors.suspensionExplanation && (
              <p className="text-red-500 text-sm mt-1">{errors.suspensionExplanation}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traffic Violations */}
      <div>
        <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
          Please list all moving traffic violations in the last 5 years (Offense, Date, Location, Comments){' '}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.trafficViolations || ''}
          onChange={(e) => setFormData({ ...formData, trafficViolations: e.target.value })}
          className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-32 transition-colors"
          placeholder="Enter offense details, dates, and locations..."
        />
        {errors.trafficViolations && <p className="text-red-500 text-sm mt-1">{errors.trafficViolations}</p>}
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
      <div className="dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 rounded-lg p-4 border">
        <p className="dark:text-sky-300 text-sky-700 text-sm">
          💼 Upload your resume so we can review your complete work history and qualifications.
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
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-100'
              : 'dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-neutral-600 border-neutral-300 bg-neutral-100 hover:border-neutral-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="text-4xl">📄</div>
            <p className="dark:text-white text-neutral-900 font-semibold">
              {uploading ? 'Uploading...' : 'Drop your resume here or click to browse'}
            </p>
            <p className="dark:text-neutral-400 text-neutral-600 text-sm">
              Supported formats: PDF • DOC • DOCX • Max 10 MB
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-2">
              <div className="h-2 dark:bg-neutral-700 bg-neutral-300 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-linear-to-r from-sky-500 to-sky-600 rounded-full"
                />
              </div>
              <p className="dark:text-sky-400 text-sky-600 text-sm font-medium">{Math.round(uploadProgress)}%</p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        /* Uploaded File Display */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark:bg-emerald-500/10 dark:border-emerald-500/30 bg-emerald-100 border-emerald-300 rounded-lg p-6 space-y-4 border"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✓</div>
              <div>
                <p className="dark:text-white text-neutral-900 font-semibold">Resume uploaded successfully</p>
                <p className="dark:text-emerald-400 text-emerald-700 text-sm mt-1">{formData.resumeFileName}</p>
                <p className="dark:text-neutral-400 text-neutral-600 text-xs mt-1">
                  {(formData.resumeFileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="dark:text-red-400 dark:hover:text-red-300 text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              Remove
            </button>
          </div>

          {/* Download Link */}
          <a
            href={formData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 text-sm font-semibold transition-colors"
          >
            View Resume
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      )}

      {/* Error Message */}
      {errors.resume && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 dark:bg-red-500/10 dark:border-red-500/30 bg-red-100 border-red-300 rounded-lg dark:text-red-400 text-red-700 text-sm border"
        >
          {errors.resume}
        </motion.div>
      )}

      {/* Info Box */}
      <div className="dark:bg-neutral-800 dark:border-neutral-700 bg-neutral-200 border-neutral-300 rounded-lg p-4 border">
        <p className="dark:text-neutral-300 text-neutral-700 text-sm">
          📌 <span className="font-semibold">Required:</span> Your resume is essential for us to review your
          qualifications and complete your application.
        </p>
      </div>
    </div>
  )
}

interface Step5CertificationProps {
  formData: any
  setFormData: (data: any) => void
  errors: any
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
        className="dark:bg-neutral-800 dark:border-neutral-700 bg-neutral-200 border-neutral-300 rounded-lg p-8 space-y-6 max-h-96 overflow-y-auto border"
      >
        <div className="space-y-6 dark:text-neutral-300 text-neutral-700 text-sm leading-relaxed">
          {certificationText.map((section, index) => (
            <div key={index} className="space-y-3">
              <p>
                <span className="font-semibold dark:text-white text-neutral-900">{section.title}</span>
              </p>
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
              type="checkbox"
              checked={formData.certifyInformation || false}
              onChange={(e) => setFormData({ ...formData, certifyInformation: e.target.checked })}
              className="w-4 h-4 rounded dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 dark:focus:ring-sky-500 border-neutral-300 bg-white text-sky-600 focus:ring-sky-500 mt-1 cursor-pointer"
            />
            <label className="dark:text-white text-neutral-900 text-sm leading-relaxed cursor-pointer">
              By signing this form, I acknowledge that all above information is valid and true to my knowledge. If you
              are under 18, please have your parent sign this section. <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.certifyInformation && <p className="text-red-500 text-sm">{errors.certifyInformation}</p>}
        </div>

        {/* Signature Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold dark:text-white text-neutral-900">
            Your Signature <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={signatureInput}
            onChange={handleSignatureChange}
            placeholder="Type your full name as signature"
            className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:border-b-sky-500 dark:text-white bg-white border-neutral-300 border-b-2 rounded-none focus:outline-none focus:ring-0 focus:dark:border-b-sky-500 focus:border-b-sky-600 text-lg tracking-wide transition-colors"
          />
          <p className="dark:text-neutral-400 text-neutral-600 text-xs">Type your full name to sign this application</p>
          {errors.signature && <p className="text-red-500 text-sm">{errors.signature}</p>}
        </div>
      </motion.div>

      {/* Agreements Checkboxes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg p-6 space-y-4 border"
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.agreeToTerms || false}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="w-4 h-4 rounded dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 dark:focus:ring-sky-500 border-neutral-300 bg-white text-sky-600 focus:ring-sky-500 mt-1 cursor-pointer"
          />
          <label className="dark:text-white text-neutral-900 text-sm cursor-pointer">
            I agree to the terms and conditions <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.authorizeBackground || false}
            onChange={(e) => setFormData({ ...formData, authorizeBackground: e.target.checked })}
            className="w-4 h-4 rounded dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 dark:focus:ring-sky-500 border-neutral-300 bg-white text-sky-600 focus:ring-sky-500 mt-1 cursor-pointer"
          />
          <label className="dark:text-white text-neutral-900 text-sm cursor-pointer">
            I authorize a background check investigation <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.understandActiveStatus || false}
            onChange={(e) => setFormData({ ...formData, understandActiveStatus: e.target.checked })}
            className="w-4 h-4 rounded dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 dark:focus:ring-sky-500 border-neutral-300 bg-white text-sky-600 focus:ring-sky-500 mt-1 cursor-pointer"
          />
          <label className="dark:text-white text-neutral-900 text-sm cursor-pointer">
            I understand applications are active for 90 days only <span className="text-red-500">*</span>
          </label>
        </div>

        {/* Errors */}
        {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}
        {errors.authorizeBackground && <p className="text-red-500 text-sm">{errors.authorizeBackground}</p>}
        {errors.understandActiveStatus && <p className="text-red-500 text-sm">{errors.understandActiveStatus}</p>}
      </motion.div>
    </div>
  )
}
