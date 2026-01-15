'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import uploadFileToFirebase from '@/app/lib/firebase/uploadFileToFirebase'

const FORM_STEPS = [
  {
    id: 1,
    name: 'Personal Info',
    fields: [
      'applicantName',
      'email',
      'cellNumber',
      'address',
      'city',
      'state',
      'zipCode',
      'positionAppliedFor',
      'employmentType',
      'hoursAvailable'
    ]
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
  { id: 4, name: 'Resume', fields: ['resume'] },
  {
    id: 5,
    name: 'Certification',
    fields: ['agreeToTerms', 'signature']
  }
]

export default function CareersPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({ hasValidDriverLicense: true, licenseSuspended: false })
  const [errors, setErrors] = useState({})

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
    // Validation logic here
    return true
  }

  const handleSubmit = async () => {
    // Submit logic here
    console.log('Submitting form:', formData)
  }

  const progress = (currentStep / FORM_STEPS.length) * 100

  return (
    <div className="">
      {/* Hero Section */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white">Join Our Team</h1>
            <p className="text-zinc-400 text-lg">
              Apply to Boys & Girls Club of Lynn and make a difference in our community
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{FORM_STEPS[currentStep - 1].name}</h2>
              <p className="text-zinc-400 text-sm mt-1">
                Step {currentStep} of {FORM_STEPS.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-sky-500 rounded-full"
            />
          </div>

          {/* Step Indicators */}
          <div className="grid grid-cols-5 gap-2 mt-6">
            {FORM_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`h-10 rounded-lg font-semibold text-sm transition-all ${
                  step.id === currentStep
                    ? 'bg-sky-500 text-white'
                    : step.id < currentStep
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
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
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6"
          >
            {/* Step 1: Personal Info */}
            {currentStep === 1 && <Step1PersonalInfo formData={formData} setFormData={setFormData} errors={errors} />}

            {/* Step 2: References */}
            {currentStep === 2 && <Step2References formData={formData} setFormData={setFormData} errors={errors} />}

            {/* Step 3: Driving Info */}
            {currentStep === 3 && <Step3DrivingInfo formData={formData} setFormData={setFormData} errors={errors} />}

            {/* Step 4: Resume */}
            {currentStep === 4 && (
              <Step4Resume formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
            )}

            {/* Step 5: Certification */}
            {currentStep === 5 && <Step5Certification formData={formData} setFormData={setFormData} errors={errors} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between gap-4 mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors ml-auto"
          >
            <span>{currentStep === FORM_STEPS.length ? 'Submit' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Save Progress Notice */}
        <div className="mt-8 text-center text-zinc-400 text-sm">
          <p>Your progress is being saved automatically</p>
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

  const toggleLanguage = (lang: string) => {
    const updated = formData.languages || []
    if (updated.includes(lang)) {
      setFormData({ ...formData, languages: updated.filter((l: string) => l !== lang) })
    } else {
      setFormData({ ...formData, languages: [...updated, lang] })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Personal Info</h3>
        <p className="text-zinc-400 text-sm">
          Your resume will provide your work history, education, and skills. We just need a few additional details.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.applicantName || ''}
            onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="John Doe"
          />
          {errors.applicantName && <p className="text-red-500 text-sm mt-1">{errors.applicantName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Position Applied For <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.positionAppliedFor || ''}
            onChange={(e) => setFormData({ ...formData, positionAppliedFor: e.target.value })}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Program Director"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.employmentType || ''}
            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">Select Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
        </div>

        {/* Hours Available */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Hours Available <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.hoursAvailable || ''}
            onChange={(e) => setFormData({ ...formData, hoursAvailable: e.target.value })}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">Select your availability</option>
            {hourOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="custom">Custom schedule</option>
          </select>
          {errors.hoursAvailable && <p className="text-red-500 text-sm mt-1">{errors.hoursAvailable}</p>}
        </div>
      </div>
      {/* Languages Spoken with Predefined Buttons */}
      <div>
        <label className="block text-sm font-semibold text-white mb-3">Languages Spoken</label>

        {/* Language Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {commonLanguages.map((lang) => (
            <motion.button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all border-2 ${
                formData.languages?.includes(lang)
                  ? 'bg-sky-500 border-sky-600 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
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
            className="mt-4 p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg"
          >
            <p className="text-zinc-300 text-sm mb-2">Selected languages:</p>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((lang: string) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-sky-500/20 border border-sky-500/50 text-sky-300 rounded-full text-sm font-medium"
                >
                  ✓ {lang}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4">
        <p className="text-sky-300 text-sm">
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">References</h3>
        <p className="text-zinc-400 text-sm">
          Please list the names of 3 work related references we may contact. Individuals with no prior work experience
          may list volunteer-related or school references such as teachers, coaches, counselors.
        </p>
      </div>

      {/* References */}
      <div className="space-y-6">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-6 transition-all border-dashed border-zinc-700 bg-zinc-900/30 opacity-50`}
          >
            <div className="space-y-6">
              {/* Referemce Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.references?.[index]?.name || ''}
                  onChange={(e) => updateReference(index, 'name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043"
                />
                {errors[`name_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`name_${index}`]}</p>}
              </div>

              {/* Type of Business */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Position & Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.references?.[index]?.positionAndCompany || ''}
                  onChange={(e) => updateReference(index, 'positionAndCompany', e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Technology / Nonprofit / Retail"
                />
                {errors[`positionAndCompany_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`positionAndCompany_${index}`]}</p>
                )}
              </div>

              {/* Job Title & Duties */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Work Relationship <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.references?.[index]?.workRelationship || ''}
                  onChange={(e) => updateReference(index, 'workRelationship', e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-24"
                  placeholder="Senior Software Engineer - Led team of 5, managed product roadmap, improved performance by 40%"
                />
                {errors[`workRelationship_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`workRelationship_${index}`]}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.references?.[index]?.phone || ''}
                    onChange={(e) => updateReference(index, 'phone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="(781) 593-1772"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.references?.[index]?.email || ''}
                    onChange={(e) => updateReference(index, 'email', e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="reference@example.com"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4">
        <p className="text-sky-300 text-sm">
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
        <h3 className="text-lg font-semibold text-white mb-2">Driving Info</h3>
        <p className="text-zinc-400 text-sm">
          This information helps us ensure safe transportation for the youth we serve.
        </p>
      </div>
      {/* Discipline - Radio Buttons */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-white">
          Do you have a valid drivers license? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              checked={formData.hasValidDriverLicense === false}
              onChange={(e) => setFormData({ ...formData, hasValidDriverLicense: false })}
              className="w-4 h-4 border-zinc-600 bg-zinc-800 text-sky-500"
            />
            <span className="text-white">No</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              checked={formData.hasValidDriverLicense === true}
              onChange={(e) => setFormData({ ...formData, hasValidDriverLicense: true })}
              className="w-4 h-4 border-zinc-600 bg-zinc-800 text-sky-500"
            />
            <span className="text-white">Yes</span>
          </label>
        </div>
      </div>

      {formData.hasValidDriverLicense ? (
        <div className="flex flex-col md:flex-row items-center gap-y-6 md:gap-x-6">
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold text-white mb-2">
              Licesnse Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.licenseNumber || ''}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder=""
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold text-white mb-2">
              Licesnse Expiration <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.licenseExpiration || ''}
              onChange={(e) => setFormData({ ...formData, licenseExpiration: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder=""
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <label className="block text-sm font-semibold text-white mb-2">
            No license reason <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.noLicenseReason || ''}
            onChange={(e) => setFormData({ ...formData, noLicenseReason: e.target.value })}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder=""
          />
        </div>
      )}

      {/* License Suspension */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-white">
          Has your license every been suspended or revoked? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              checked={formData.licenseSuspended === false}
              onChange={(e) => setFormData({ ...formData, licenseSuspended: false })}
              className="w-4 h-4 border-zinc-600 bg-zinc-800 text-sky-500"
            />
            <span className="text-white">No</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              checked={formData.licenseSuspended === true}
              onChange={(e) => setFormData({ ...formData, licenseSuspended: true })}
              className="w-4 h-4 border-zinc-600 bg-zinc-800 text-sky-500"
            />
            <span className="text-white">Yes</span>
          </label>
        </div>
      </div>
      {formData.licenseSuspended && (
        <div className="flex flex-col w-full">
          <label className="block text-sm font-semibold text-white mb-2">
            Please explain. <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.suspensionExplanation || ''}
            onChange={(e) => setFormData({ ...formData, suspensionExplanation: e.target.value })}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder=""
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Please list all moving traffic violations in the last 5 years. (Offense, Date, Location, Comments){' '}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.trafficViolations || ''}
          onChange={(e) => setFormData({ ...formData, trafficViolations: e.target.value })}
          className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-32"
          placeholder="Describe your previous employment..."
        />
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
      console.error('Upload error:', error)
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

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4">
        <p className="text-sky-300 text-sm">
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
            dragActive ? 'border-sky-500 bg-sky-500/10' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
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
            <p className="text-white font-semibold">
              {uploading ? 'Uploading...' : 'Drop your resume here or click to browse'}
            </p>
            <p className="text-zinc-400 text-sm">Supported formats: PDF • Max 10 MB</p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-2">
              <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-sky-500 rounded-full"
                />
              </div>
              <p className="text-sky-400 text-sm font-medium">{Math.round(uploadProgress)}%</p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        /* Uploaded File Display */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✓</div>
              <div>
                <p className="text-white font-semibold">Resume uploaded successfully</p>
                <p className="text-green-400 text-sm mt-1">{formData.resumeFileName}</p>
                <p className="text-zinc-400 text-xs mt-1">{(formData.resumeFileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  resumeUrl: null,
                  resumeFileName: null,
                  resumeFileSize: null,
                  resumeUploadedAt: null
                })
                setErrors({ ...errors, resume: '' })
              }}
              className="text-red-400 hover:text-red-300 font-semibold"
            >
              Remove
            </button>
          </div>

          {/* Download Link */}

          <a
            href={formData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-semibold"
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
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
        >
          {errors.resume}
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
        <p className="text-zinc-300 text-sm">
          📌 <span className="font-semibold">Required:</span> Your resume is essential for us to review your
          qualifications and complete your application.
        </p>
      </div>
    </div>
  )
}

function Step5Certification({ formData, setFormData, errors }: any) {
  const [signatureInput, setSignatureInput] = useState('')

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignatureInput(e.target.value)
    setFormData({ ...formData, signature: e.target.value })
  }

  return (
    <div className="space-y-6">
      {/* Certification Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 space-y-6 max-h-96 overflow-y-auto"
      >
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <p>
            <span className="font-semibold text-white">Equal Opportunity Employer</span>
          </p>
          <p>
            The Boys & Girls Club of Lynn is an equal opportunity employer. Applicants are considered for positions
            without regard to veteran status, uniformed service member status, race, color, religion, sex, national
            origin, age, physical or mental disability, genetic information or any other category protected by
            applicable federal, state, or local laws.
          </p>

          <p>
            <span className="font-semibold text-white">Information Accuracy</span>
          </p>
          <p>
            I certify that all the information on this application, my resume, or any supporting documents I may present
            during any interview is and will be complete and accurate to the best of my knowledge. I understand that any
            falsification, misrepresentation, or omission of any information may result in disqualification from
            consideration for employment or, if employed, disciplinary action, up to and including immediate dismissal.
          </p>

          <p>
            <span className="font-semibold text-white">At-Will Employment</span>
          </p>
          <p>
            THE BOYS & GIRLS CLUB OF LYNN IS AN AT-WILL EMPLOYER AS ALLOWED BY APPLICABLE STATE LAW. THIS MEANS THAT
            REGARDLESS OF ANY PROVISION IN THIS APPLICATION, IF HIRED, THE BOYS & GIRLS CLUB OF LYNN OR I MAY TERMINATE
            THE EMPLOYMENT RELATIONSHIP AT ANY TIME, FOR ANY REASON, WITH OR WITHOUT CAUSE OR NOTICE. NOTHING IN THIS
            APPLICATION OR IN ANY DOCUMENT OR STATEMENT, WRITTEN OR ORAL, SHALL LIMIT THE RIGHT TO TERMINATE EMPLOYMENT
            AT-WILL. NO OFFICER, EMPLOYEE OR REPRESENTATIVE OF THE BOYS & GIRLS CLUB OF LYNN IS AUTHORIZED TO ENTER INTO
            AN AGREEMENT-EXPRESS OR IMPLIED-WITH ME OR ANY APPLICANT FOR EMPLOYMENT FOR A SPECIFIED PERIOD OF TIME
            UNLESS SUCH AN AGREEMENT IS IN A WRITTEN CONTRACT SIGNED BY THE PRESIDENT OF THE BOYS & GIRLS CLUB OF LYNN.
            IF HIRED, I AGREE TO CONFORM TO THE RULES AND REGULATIONS OF THE BOYS & GIRLS CLUB OF LYNN, AND I UNDERSTAND
            THAT THE BOYS & GIRLS CLUB OF LYNN HAS COMPLETE DISCRETION TO MODIFY SUCH RULES AND REGULATIONS AT ANY TIME,
            EXCEPT THAT IT WILL NOT MODIFY THIS POLICY OF EMPLOYMENT AT-WILL.
          </p>

          <p>
            <span className="font-semibold text-white">Background Investigation Authorization</span>
          </p>
          <p>
            I authorize the Boys & Girls Club of Lynn or its agents to confirm all statements contained in this
            application and/or resume as it relates to the position, I am seeking to the extent permitted by federal,
            state, or local law. I agree to complete any requisite authorization forms for the background investigation
            which may be permitted by federal, state and/or local law.
          </p>

          <p>
            <span className="font-semibold text-white">Legal Work Authorization</span>
          </p>
          <p>
            If hired by the Boys & Girls Club of Lynn, I understand that I will be required to provide genuine
            documentation establishing my identity and eligibility to be legally employed in the United States by the
            Boys & Girls Club of Lynn. I also understand that the Boys & Girls Club of Lynn employs only individuals who
            are legally eligible to work in the United States.
          </p>

          <p>
            <span className="font-semibold text-white">Active Application Status</span>
          </p>
          <p>
            THIS APPLICATION WILL BE CONSIDERED ACTIVE FOR A MAXIMUM OF NINETY (90) DAYS. IF YOU WISH TO BE CONSIDERED
            FOR EMPLOYMENT AFTER THAT TIME, YOU MUST REAPPLY.
          </p>
        </div>
      </motion.div>

      {/* Signature Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.certifyInformation || false}
              onChange={(e) => setFormData({ ...formData, certifyInformation: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-sky-500 focus:ring-sky-500 mt-1"
            />
            <label className="text-white text-sm leading-relaxed">
              By signing this form, I acknowledge that all above information is valid and true to my knowledge. If you
              are under 18, please have your parent sign this section. <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.certifyInformation && <p className="text-red-500 text-sm">{errors.certifyInformation}</p>}
        </div>

        {/* Signature Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">
            Your Signature <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={signatureInput}
            onChange={handleSignatureChange}
            placeholder="Type your full name as signature"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-b-2 border-zinc-700 rounded-none text-white focus:outline-none focus:ring-0 focus:border-b-sky-500 text-lg tracking-wide"
          />
          <p className="text-zinc-400 text-xs">Type your full name to sign this application</p>
          {errors.signature && <p className="text-red-500 text-sm">{errors.signature}</p>}
        </div>
      </motion.div>

      {/* Agreements Checkboxes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4"
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.agreeToTerms || false}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-sky-500 focus:ring-sky-500 mt-1"
          />
          <label className="text-white text-sm">
            I agree to the terms and conditions <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.authorizeBackground || false}
            onChange={(e) => setFormData({ ...formData, authorizeBackground: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-sky-500 focus:ring-sky-500 mt-1"
          />
          <label className="text-white text-sm">
            I authorize a background check investigation <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.understandActiveStatus || false}
            onChange={(e) => setFormData({ ...formData, understandActiveStatus: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-sky-500 focus:ring-sky-500 mt-1"
          />
          <label className="text-white text-sm">
            I understand applications are active for 90 days only <span className="text-red-500">*</span>
          </label>
        </div>
      </motion.div>
    </div>
  )
}
