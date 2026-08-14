'use client'

import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { User, MapPin, ChevronRight, Loader2, Phone } from 'lucide-react'

import { US_STATES } from '@/lib/constants/states'
import { formatPhone } from '@/lib/utils/phone.utils'
import { TicketCheckoutFormInput } from '@/lib/validations/ticket-checkout.validation'

const inputClass = `
  w-full px-4 py-2.5 rounded-xl border
  dark:border-neutral-700 border-neutral-200
  dark:bg-neutral-900 bg-neutral-50
  dark:text-white text-neutral-900
  dark:placeholder-neutral-500 placeholder-neutral-400
  text-sm focus:outline-none focus:ring-2 focus:ring-sky-500
  focus:border-transparent transition-all
`

const labelClass = 'block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5'
const errorClass = 'mt-1.5 text-xs text-red-500 dark:text-red-400'
const sectionLabelClass = 'text-xs font-bold uppercase tracking-widest dark:text-neutral-400 text-neutral-500'

type Props = {
  /** Validates the step's fields, saves, and advances. */
  onSubmit: () => void | Promise<void>
}

export function CheckoutStep2({ onSubmit }: Props) {
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<TicketCheckoutFormInput>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await onSubmit()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 rounded-2xl border p-5 sm:p-8 shadow-lg">
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-linear-to-b from-sky-500 to-sky-600 rounded-full shrink-0" aria-hidden="true" />
        Your Information
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Name section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
            <p className={sectionLabelClass}>Personal Details</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Maria"
                autoComplete="given-name"
                className={inputClass}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p id="firstName-error" role="alert" className={errorClass}>
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Santos"
                autoComplete="family-name"
                className={inputClass}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p id="lastName-error" role="alert" className={errorClass}>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phone section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
            <p className={sectionLabelClass}>Contact Information</p>
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone Number *
            </label>
            {/* Display is formatted, stored value is digits only */}
            <Controller
              name="phone"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="(978) 645-9865"
                  autoComplete="tel"
                  className={inputClass}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  value={formatPhone(value ?? '')}
                  onBlur={onBlur}
                  onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              )}
            />
            {errors.phone && (
              <p id="phone-error" role="alert" className={errorClass}>
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Address section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
            <p className={sectionLabelClass}>Billing Address</p>
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor="addressLine1" className={labelClass}>
                Street Address *
              </label>
              <input
                id="addressLine1"
                type="text"
                placeholder="123 Main Street"
                autoComplete="street-address"
                className={inputClass}
                aria-invalid={!!errors.addressLine1}
                aria-describedby={errors.addressLine1 ? 'addressLine1-error' : undefined}
                {...register('addressLine1')}
              />
              {errors.addressLine1 && (
                <p id="addressLine1-error" role="alert" className={errorClass}>
                  {errors.addressLine1.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="addressLine2" className={labelClass}>
                Unit/Apt #
              </label>
              <input
                id="addressLine2"
                type="text"
                placeholder="Unit 1"
                autoComplete="address-line2"
                className={inputClass}
                {...register('addressLine2')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label htmlFor="city" className={labelClass}>
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Lynn"
                  autoComplete="address-level2"
                  className={inputClass}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  {...register('city')}
                />
                {errors.city && (
                  <p id="city-error" role="alert" className={errorClass}>
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="state" className={labelClass}>
                  State *
                </label>
                <select
                  id="state"
                  autoComplete="address-level1"
                  className={inputClass}
                  aria-invalid={!!errors.state}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                  {...register('state')}
                >
                  <option value="" disabled>
                    State
                  </option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p id="state-error" role="alert" className={errorClass}>
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="zipPostalCode" className={labelClass}>
                  ZIP Code *
                </label>
                <input
                  id="zipPostalCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="01901"
                  autoComplete="postal-code"
                  maxLength={10}
                  className={inputClass}
                  aria-invalid={!!errors.zipPostalCode}
                  aria-describedby={errors.zipPostalCode ? 'zipPostalCode-error' : undefined}
                  {...register('zipPostalCode')}
                />
                {errors.zipPostalCode && (
                  <p id="zipPostalCode-error" role="alert" className={errorClass}>
                    {errors.zipPostalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-sky-500/25 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              Continue to Payment
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
