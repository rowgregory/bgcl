'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { createSubscriber } from '@/lib/actions/subscriber/createSubscriber'
import { SUBSCRIBER_TYPE_OPTIONS } from '@/lib/constants/subscriber.constants'
import {
  EMPTY_SUBSCRIBER,
  subscriberSchema,
  type SubscriberFormInput,
  type SubscriberFormValues
} from '@/lib/validations/subscriber.validation'

// Tailwind can't build class names from interpolated values, so each accent
// spells its classes out in full.
const accents = {
  purple: {
    input: 'focus:ring-purple-600 dark:focus:ring-purple-500',
    radio:
      'peer-checked:bg-purple-600 peer-checked:border-purple-600 dark:peer-checked:bg-purple-500 dark:peer-checked:border-purple-500',
    button:
      'px-8 py-4 h-15 rounded-2xl bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus-visible:ring-purple-500'
  },
  sky: {
    input: 'focus:ring-sky-600 dark:focus:ring-sky-500',
    radio:
      'peer-checked:bg-sky-600 peer-checked:border-sky-600 dark:peer-checked:bg-sky-500 dark:peer-checked:border-sky-500',
    button: 'px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 focus-visible:ring-sky-500'
  }
} as const

type Props = {
  accent?: keyof typeof accents
}

export default function NewsletterSignup({ accent = 'sky' }: Props) {
  const router = useRouter()
  const [subscribed, setSubscribed] = useState(false)

  const emailId = useId()
  const emailErrorId = useId()

  const theme = accents[accent]

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<SubscriberFormInput, unknown, SubscriberFormValues>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: EMPTY_SUBSCRIBER,
    mode: 'onTouched'
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await createSubscriber(values)

      if (!res.success) {
        setError('root', { message: res.error })
        return
      }

      reset(EMPTY_SUBSCRIBER)
      setSubscribed(true)
      router.refresh()
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' })
    }
  })

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {errors.root && (
          <motion.div
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
            <p className="text-sm text-red-800 dark:text-red-200">{errors.root.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {subscribed && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">Thanks for subscribing!</p>
              <p className="text-xs text-green-700 dark:text-green-300">Check your email for updates</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} noValidate aria-label="Newsletter subscription form" className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor={emailId} className="block text-xs font-medium dark:text-neutral-400 text-neutral-600 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 dark:text-neutral-500 text-neutral-400 pointer-events-none"
            />
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? emailErrorId : undefined}
              className={`w-full pl-10 pr-3 py-2.5 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:placeholder-neutral-600 bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${theme.input}`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p id={emailErrorId} role="alert" className="mt-1.5 text-xs text-red-500 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Membership Type */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-medium dark:text-neutral-400 text-neutral-600 uppercase tracking-wide">
            I am a:
          </legend>
          <div className="space-y-2">
            {SUBSCRIBER_TYPE_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="radio" value={value} className="sr-only peer" {...register('type')} />
                <div
                  aria-hidden="true"
                  className={`w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 transition-all ${theme.radio}`}
                />
                <span className="text-sm dark:text-neutral-400 text-neutral-600 group-hover:dark:text-neutral-300 group-hover:text-neutral-900 transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Subscribe Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className={`flex items-center justify-center gap-2 text-white font-semibold transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.button}`}
        >
          {isSubmitting && (
            <div aria-hidden="true" className="w-4 h-4 rounded-full border-2 border-white border-t-0 animate-spin" />
          )}
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
