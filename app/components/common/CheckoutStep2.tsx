'use client'

import { US_STATES } from '@/app/lib/constants/states'
import { formatPhone } from '@/app/lib/utils/phone.utils'
import { isValidPhoneNumber, isValidZipPostalCode } from '@/app/lib/utils/regex'
import { User, MapPin, ChevronRight, Loader2, Phone } from 'lucide-react'

interface UserInfoForm {
  firstName: string
  lastName: string
  phone: string
  addressLine1: string
  city: string
  state: string
  zipPostalCode: string
}

const inputClass = `
  w-full px-4 py-2.5 rounded-xl border
  dark:border-neutral-700 border-neutral-200
  dark:bg-neutral-900 bg-neutral-50
  dark:text-white text-neutral-900
  dark:placeholder-neutral-500 placeholder-neutral-400
  text-sm focus:outline-none focus:ring-2 focus:ring-sky-500
  focus:border-transparent transition-all
`

type ICheckoutStep2 = {
  onSubmit: () => void
  isLoading?: boolean
  inputs: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
  handleInput: any
  errors: Record<string, string>
}

function validate(inputs, setErrors): boolean {
  const newErrors: Partial<UserInfoForm> = {}
  if (!inputs?.firstName?.trim()) newErrors.firstName = 'First name is required'
  if (!inputs?.lastName?.trim()) newErrors.lastName = 'Last name is required'
  if (!isValidPhoneNumber(inputs?.phone?.trim())) newErrors.phone = 'Phone number is required'
  if (!inputs?.addressLine1?.trim()) newErrors.addressLine1 = 'Address is required'
  if (!inputs?.city?.trim()) newErrors.city = 'City is required'
  if (!inputs?.state) newErrors.state = 'State is required'
  if (!inputs?.zipPostalCode?.trim()) newErrors.zipPostalCode = 'ZIP code is required'
  else if (!isValidZipPostalCode(inputs?.zipPostalCode)) newErrors.zipPostalCode = 'Enter a valid ZIP code'
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export function CheckoutStep2({ onSubmit, isLoading = false, inputs, setErrors, handleInput, errors }: ICheckoutStep2) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate(inputs, setErrors)) onSubmit()
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
            <p className="text-xs font-bold uppercase tracking-widest dark:text-neutral-400 text-neutral-500">
              Personal Details
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5"
              >
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={inputs?.firstName ?? ''}
                onChange={handleInput}
                placeholder="Maria"
                autoComplete="given-name"
                className={inputClass}
                aria-invalid={!!errors?.firstName}
                aria-describedby={errors?.firstName ? 'firstName-error' : undefined}
              />
              {errors?.firstName && (
                <p id="firstName-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                  {errors?.firstName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5"
              >
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={inputs?.lastName ?? ''}
                onChange={handleInput}
                placeholder="Santos"
                autoComplete="family-name"
                className={inputClass}
                aria-invalid={!!errors?.lastName}
                aria-describedby={errors?.lastName ? 'lastName-error' : undefined}
              />
              {errors?.lastName && (
                <p id="lastName-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                  {errors?.lastName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phone section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-widest dark:text-neutral-400 text-neutral-500">
              Contact Information
            </p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5">
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formatPhone(inputs.phone || '')}
              onChange={(e) =>
                handleInput({
                  ...e,
                  target: { ...e.target, name: 'phone', value: e.target.value.replace(/\D/g, '').slice(0, 10) }
                })
              }
              placeholder="(978) 645-9865"
              autoComplete="phone"
              className={inputClass}
              aria-invalid={!!errors?.phone}
              aria-describedby={errors?.phone ? 'phone-error' : undefined}
            />
            {errors?.phone && (
              <p id="phone-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                {errors?.phone}
              </p>
            )}
          </div>
        </div>

        {/* Address section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-widest dark:text-neutral-400 text-neutral-500">
              Billing Address
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="addressLine1"
                className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5"
              >
                Street Address *
              </label>
              <input
                id="addressLine1"
                name="addressLine1"
                type="text"
                value={inputs?.addressLine1 ?? ''}
                onChange={handleInput}
                placeholder="123 Main Street"
                autoComplete="street-address"
                className={inputClass}
                aria-invalid={!!errors?.addressLine1}
                aria-describedby={errors?.addressLine1 ? 'addressLine1-error' : undefined}
              />
              {errors?.addressLine1 && (
                <p id="addressLine-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                  {errors?.addressLine1}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="addressLine2"
                className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5"
              >
                Unit/Apt #
              </label>
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                value={inputs?.addressLine2 ?? ''}
                onChange={handleInput}
                placeholder="Unit 1"
                autoComplete="street-address"
                className={inputClass}
                aria-invalid={!!errors?.addressLine2}
                aria-describedby={errors?.addressLine2 ? 'addressLine2-error' : undefined}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label
                  htmlFor="city"
                  className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5"
                >
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={inputs?.city ?? ''}
                  onChange={handleInput}
                  placeholder="Lynn"
                  autoComplete="address-level2"
                  className={inputClass}
                  aria-invalid={!!errors?.city}
                  aria-describedby={errors?.city ? 'city-error' : undefined}
                />
                {errors?.city && (
                  <p id="city-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                    {errors?.city}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5"
                >
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  value={inputs?.state ?? ''}
                  onChange={handleInput}
                  autoComplete="address-level1"
                  className={inputClass}
                  aria-invalid={!!errors?.state}
                  aria-describedby={errors?.state ? 'state-error' : undefined}
                >
                  <option value="" disabled>
                    State
                  </option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors?.state && (
                  <p id="state-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                    {errors?.state}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="zipPostalCode"
                  className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5"
                >
                  ZIP Code *
                </label>
                <input
                  id="zipPostalCode"
                  name="zipPostalCode"
                  type="text"
                  inputMode="numeric"
                  value={inputs?.zipPostalCode ?? ''}
                  onChange={handleInput}
                  placeholder="01901"
                  autoComplete="postal-code"
                  maxLength={10}
                  className={inputClass}
                  aria-invalid={!!errors?.zipPostalCode}
                  aria-describedby={errors?.zipPostalCode ? 'zipPostalCode-error' : undefined}
                />
                {errors?.zipPostalCode && (
                  <p id="zipPostalCode-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                    {errors?.zipPostalCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-sky-500/25 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
        >
          {isLoading ? (
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
