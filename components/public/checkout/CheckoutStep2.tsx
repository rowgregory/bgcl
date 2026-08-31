'use client'

import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { US_STATES } from '@/lib/constants/states'
import { formatPhone } from '@/lib/utils/phone.utils'
import { TicketCheckoutFormInput } from '@/lib/validations/ticket-checkout.validation'

const fieldCls =
  'w-full px-5 py-4 text-[15px] bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all'
const labelCls = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'
const errorCls = 'mt-2 text-sm text-red-600 dark:text-red-400'
const groupCls = 'text-sm text-neutral-500 dark:text-neutral-400 mb-4'

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
    <div>
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-8">Your information</h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">
        <div className="pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <p className={groupCls}>Your name</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelCls}>
                First name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Maria"
                autoComplete="given-name"
                className={fieldCls}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p id="firstName-error" role="alert" className={errorCls}>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className={labelCls}>
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Santos"
                autoComplete="family-name"
                className={fieldCls}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p id="lastName-error" role="alert" className={errorCls}>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="phone" className={labelCls}>
              Phone
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
                  className={`${fieldCls} tabular-nums`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  value={formatPhone(value ?? '')}
                  onBlur={onBlur}
                  onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              )}
            />

            {errors.phone && (
              <p id="phone-error" role="alert" className={errorCls}>
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="py-8">
          <p className={groupCls}>Billing address</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="addressLine1" className={labelCls}>
                Street address
              </label>
              <input
                id="addressLine1"
                type="text"
                placeholder="123 Main Street"
                autoComplete="street-address"
                className={fieldCls}
                aria-invalid={!!errors.addressLine1}
                aria-describedby={errors.addressLine1 ? 'addressLine1-error' : undefined}
                {...register('addressLine1')}
              />
              {errors.addressLine1 && (
                <p id="addressLine1-error" role="alert" className={errorCls}>
                  {errors.addressLine1.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="addressLine2" className={labelCls}>
                Apartment or unit <span className="text-neutral-400 dark:text-neutral-600 font-normal">(optional)</span>
              </label>
              <input
                id="addressLine2"
                type="text"
                placeholder="Unit 1"
                autoComplete="address-line2"
                className={fieldCls}
                {...register('addressLine2')}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label htmlFor="city" className={labelCls}>
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Lynn"
                  autoComplete="address-level2"
                  className={fieldCls}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  {...register('city')}
                />
                {errors.city && (
                  <p id="city-error" role="alert" className={errorCls}>
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="state" className={labelCls}>
                  State
                </label>
                <select
                  id="state"
                  autoComplete="address-level1"
                  className={fieldCls}
                  aria-invalid={!!errors.state}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                  {...register('state')}
                >
                  <option value="" disabled>
                    ST
                  </option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p id="state-error" role="alert" className={errorCls}>
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="zipPostalCode" className={labelCls}>
                  ZIP
                </label>
                <input
                  id="zipPostalCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="01901"
                  autoComplete="postal-code"
                  maxLength={10}
                  className={`${fieldCls} tabular-nums`}
                  aria-invalid={!!errors.zipPostalCode}
                  aria-describedby={errors.zipPostalCode ? 'zipPostalCode-error' : undefined}
                  {...register('zipPostalCode')}
                />
                {errors.zipPostalCode && (
                  <p id="zipPostalCode-error" role="alert" className={errorCls}>
                    {errors.zipPostalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full px-5 py-4 text-[15px] font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          {isSaving ? 'Saving…' : 'Continue to payment'}
        </button>
      </form>
    </div>
  )
}
