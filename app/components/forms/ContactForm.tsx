import { createContactSubmission } from '@/app/lib/actions/createContactSubmission'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store, useFormSelector } from '@/app/lib/store/store'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import { validateContactSubmissionForm } from '@/app/lib/validations/contact-submission'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface CreateContactSusmissionInputs {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  subject: string
  type: 'GENERAL'
  status: 'NEW'
}

const ContactForm = () => {
  const { forms } = useFormSelector()
  const router = useRouter()
  const { handleInput, setErrors } = createFormActions('contactForm', store.dispatch)
  const inputs = forms?.contactForm?.inputs
  const errors = forms?.contactForm?.errors

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateContactSubmissionForm(inputs, setErrors)) return
    try {
      store.dispatch(setIsLoading(true))

      await createContactSubmission(inputs as CreateContactSusmissionInputs)

      router.refresh()

      store.dispatch(resetForm('contactForm'))

      store.dispatch(
        showToast({
          message: 'Contact submitted!',
          description: 'Your contact submission has been successfully received!'
        })
      )
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: 'Submission failed to send.',
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="lg:col-span-2"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={inputs.firstName ?? ''}
                onChange={handleInput}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                placeholder="Sqysh"
              />
              {errors?.firstName && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={inputs.lastName ?? ''}
                onChange={handleInput}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                placeholder="Io"
              />
              {errors?.lastName && <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={inputs.email ?? ''}
                onChange={handleInput}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                placeholder="sqysh@sqysh.io"
              />
              {errors?.email && <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={inputs.phone ?? ''}
                onChange={handleInput}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                placeholder="9788101234"
              />
              {errors?.phone && <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
              Subject
            </label>
            <select
              name="subject"
              value={inputs.subject ?? ''}
              onChange={handleInput}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            >
              <option value="">Select a subject</option>
              <option value="tour">Schedule a Tour</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={inputs.message ?? ''}
              onChange={handleInput}
              rows={5}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors resize-none"
              placeholder="Tell us more about your inquiry..."
            />
            {errors?.message && <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 sm:py-4 text-sm sm:text-base dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
          >
            Send Message
          </button>
        </div>
      </div>
    </motion.form>
  )
}

export default ContactForm
