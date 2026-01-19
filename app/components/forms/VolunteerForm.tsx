'use client'

import { motion } from 'framer-motion'
import { store, useFormSelector } from '@/app/lib/store/store'
import { createFormActions, setInputs, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { validateContactSubmissionForm } from '@/app/lib/validations/contact-submission'
import { createContactSubmission } from '@/app/lib/actions/createContactSubmission'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useRouter } from 'next/navigation'
import { setCloseVolunteerDrawer } from '@/app/lib/store/slices/appSlice'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const hoursOptions = [
  { value: 'morning', label: 'Morning (8am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { value: 'evening', label: 'Evening (5pm - 8pm)' },
  { value: 'flexible', label: 'Flexible' }
]

const parseStringArray = (str: string | null | undefined): string[] => {
  return str ? str.split(',').map((item) => item.trim()) : []
}

export const stringifyArray = (arr: string[]): string => {
  return arr.join(', ')
}

export default function VolunteerForm({ programs }) {
  const router = useRouter()
  const { forms, isLoading } = useFormSelector()
  const { handleInput, handleToggle, setErrors } = createFormActions('volunteerForm', store.dispatch)

  const inputs = forms?.volunteerForm?.inputs
  const errors = forms?.volunteerForm?.errors

  const onClose = () => store.dispatch(setCloseVolunteerDrawer())

  const handleDayToggle = (day: string) => {
    const daysArray = parseStringArray(inputs?.availabilityDays)
    const updatedDays = daysArray.includes(day) ? daysArray.filter((d) => d !== day) : [...daysArray, day]

    store.dispatch(
      setInputs({
        formName: 'volunteerForm',
        data: {
          availabilityDays: stringifyArray(updatedDays)
        }
      })
    )
  }

  const handleProgramToggle = (program: string) => {
    const programsArray = parseStringArray(inputs?.programInterests)
    const updatedPrograms = programsArray.includes(program)
      ? programsArray.filter((p) => p !== program)
      : [...programsArray, program]

    store.dispatch(
      setInputs({
        formName: 'volunteerForm',
        data: {
          programInterests: stringifyArray(updatedPrograms)
        }
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateContactSubmissionForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading(true))

      await createContactSubmission({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        phone: inputs.phone,
        availabilityDays: inputs.availabilityDays,
        availabilityHours: inputs.availabilityHours,
        programInterests: inputs.programInterests,
        backgroundCheckAck: inputs.backgroundCheckAck,
        additionalInfo: inputs.additionalInfo,
        type: 'VOLUNTEER',
        status: 'NEW'
      })
      router.refresh()

      onClose()

      store.dispatch(showToast({ message: 'You have successfully submitted a volunteer application!' }))
    } catch {
      store.dispatch(
        showToast({ message: 'There was an error submitting your application. Please try again.', type: 'error' })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

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

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold dark:text-white text-neutral-900">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={inputs.firstName ?? ''}
                onChange={handleInput}
                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                placeholder="John"
              />
              {errors?.firstName && <p className="mt-2 text-sm text-red-400">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={inputs.lastName ?? ''}
                onChange={handleInput}
                className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                placeholder="Doe"
              />
              {errors?.lastName && <p className="mt-2 text-sm text-red-400">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={inputs.email ?? ''}
              onChange={handleInput}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder="john@example.com"
            />
            {errors?.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={inputs.phone ?? ''}
              onChange={handleInput}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder="9788101234"
            />
            {errors?.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
          <h2 className="text-xl font-bold dark:text-white text-neutral-900">Availability</h2>

          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-3">
              Which days can you volunteer?
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {daysOfWeek.map((day) => (
                <motion.button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all border ${
                    inputs.availabilityDays?.includes(day)
                      ? 'dark:bg-sky-600 dark:border-sky-500 bg-sky-600 border-sky-600 text-white'
                      : 'dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {day}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-3">
              Preferred time of day
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {hoursOptions.map((option) => (
                <motion.label
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                    inputs.availabilityHours === option.value
                      ? 'dark:bg-sky-600/10 dark:border-sky-500/50 bg-sky-100/50 border-sky-300'
                      : 'dark:bg-neutral-900 dark:border-neutral-700 bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="availabilityHours"
                    value={option.value ?? ''}
                    checked={inputs.availabilityHours === option.value}
                    onChange={handleInput}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="ml-3 dark:text-neutral-300 text-neutral-700 font-medium">{option.label}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </div>

        {/* Program Interests */}
        <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
          <h2 className="text-xl font-bold dark:text-white text-neutral-900">Program Interests</h2>
          <p className="text-sm dark:text-neutral-400 text-neutral-600">
            Which programs are you most interested in volunteering with?
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {programOptions.map((program) => (
              <motion.label
                key={program.value}
                whileHover={{ scale: 1.02 }}
                className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                  inputs.programInterests?.includes(program.value)
                    ? 'dark:bg-sky-600/10 dark:border-sky-500/50 bg-sky-100/50 border-sky-300'
                    : 'dark:bg-neutral-900 dark:border-neutral-700 bg-neutral-50 border-neutral-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={inputs.programInterests?.includes(program.value) ?? false}
                  onChange={() => handleProgramToggle(program.value)}
                  className="w-4 h-4 mt-0.5 cursor-pointer"
                />
                <span className="ml-3 dark:text-neutral-300 text-neutral-700 font-medium">{program.label}</span>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4 dark:border-neutral-800 border-neutral-200 border-t pt-8">
          <h2 className="text-xl font-bold dark:text-white text-neutral-900">Additional Information</h2>

          <div>
            <label className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              Tell us more about yourself
            </label>
            <textarea
              name="additionalInfo"
              value={inputs.additionalInfo ?? ''}
              onChange={handleInput}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none"
              placeholder="Share any relevant experience, skills, or why you want to volunteer..."
              rows={4}
            />
          </div>
        </div>

        {/* Background Check Acknowledgment */}
        <div className="space-y-4 dark:bg-neutral-900/50 dark:border-neutral-700 bg-neutral-50 border-neutral-200 border rounded-lg p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="backgroundCheckAck"
              checked={inputs.backgroundCheckAck ?? false}
              onChange={handleToggle}
              className="w-5 h-5 mt-1 cursor-pointer"
            />
            <span className="dark:text-neutral-300 text-neutral-700">
              <span className="font-medium">I understand and agree *</span>
              <p className="text-sm dark:text-neutral-400 text-neutral-600 mt-1">
                All volunteers are required to pass a background check. By submitting this application, I acknowledge
                this requirement and consent to the process.
              </p>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-t-0 border-white animate-spin rounded-full" />
              Submitting...
            </div>
          ) : (
            'Submit Application'
          )}
        </motion.button>

        {/* Required Fields Note */}
        <p className="text-xs dark:text-neutral-500 text-neutral-600 text-center">Fields marked with * are required</p>
      </motion.form>
    </div>
  )
}
