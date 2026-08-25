import { motion } from 'framer-motion'

interface NextStepsProps {
  isDonation: boolean
  isRecurring: boolean
  customerEmail?: string
}

export const NextSteps = ({ isDonation, isRecurring, customerEmail }: NextStepsProps) => {
  const steps = isDonation
    ? [
        `A confirmation email has been sent to ${customerEmail}`,
        isRecurring
          ? 'Your recurring donation will continue automatically'
          : 'You will receive a tax receipt for your donation',
        'Thank you for supporting our youth programs!'
      ]
    : [
        'Check your email for digital tickets',
        'Bring your ticket confirmation to the event',
        'We look forward to seeing you there!'
      ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 mb-8"
    >
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">What&apos;s Next?</h3>
      <ol className="space-y-3 text-neutral-700 dark:text-neutral-300">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </motion.div>
  )
}
