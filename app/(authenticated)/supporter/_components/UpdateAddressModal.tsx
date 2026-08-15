'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Loader2, Check } from 'lucide-react'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { US_STATES } from '@/lib/constants/states'
import { useRouter } from 'next/navigation'
import { useAddressModal } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import { AddressFormInput, AddressFormValues, addressSchema, EMPTY_ADDRESS } from '@/lib/validations/address.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import Backdrop from '@/components/_shared/Backdrop'
import { inputCls } from '@/lib/constants/form.constants'

export function UpdateAddressModal() {
  const router = useRouter()
  const isOpen = useAddressModal((s) => s.isOpen)
  const address = useAddressModal((s) => s.data)
  const onClose = useAddressModal((s) => s.close)

  const methods = useForm<AddressFormInput, unknown, AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: EMPTY_ADDRESS,
    mode: 'onTouched'
  })

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = methods

  useEffect(() => {
    if (!isOpen) return

    reset(
      address
        ? {
            addressLine1: address.addressLine1 ?? '',
            addressLine2: address.addressLine2 ?? '',
            city: address.city ?? '',
            state: address.state ?? '',
            zipPostalCode: address.zipPostalCode ?? '',
            country: address.country ?? 'US'
          }
        : EMPTY_ADDRESS
    )
  }, [isOpen, address, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await updateAddress(values)

      if (!res.success) {
        setError('root', { message: res.error })
        return
      }

      onClose()
      router.refresh()
    } catch {
      setError('root', { message: 'Failed to update address. Please try again.' })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="address-modal-title"
              className="w-full max-w-md dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-neutral-200 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
            >
              <FormProvider {...methods}>
                <form id="addressForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b dark:border-neutral-800 border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg dark:bg-sky-500/20 bg-sky-100 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
                      </div>
                      <h2 id="address-modal-title" className="text-sm font-bold dark:text-white text-neutral-900">
                        {address?.addressLine1 ? 'Update Address' : 'Add Address'}
                      </h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-lg dark:text-neutral-500 text-neutral-400 dark:hover:text-white hover:text-neutral-900 dark:hover:bg-neutral-800 hover:bg-neutral-100 transition-all"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="px-5 py-5 space-y-3">
                    {/* Address line 1 */}
                    <div>
                      <label
                        htmlFor="addressLine1"
                        className="block text-xs font-medium dark:text-neutral-400 text-neutral-500 mb-1.5"
                      >
                        Street Address *
                      </label>
                      <input
                        id="addressLine1"
                        name="addressLine1"
                        type="text"
                        {...register('addressLine1')}
                        placeholder="123 Main Street"
                        autoComplete="address-line1"
                        autoFocus
                        className={inputCls}
                        aria-invalid={!!errors?.addressLine1}
                      />
                      {errors?.addressLine1 && (
                        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors?.addressLine1.message}</p>
                      )}
                    </div>

                    {/* Address line 2 */}
                    <div>
                      <label
                        htmlFor="addressLine2"
                        className="block text-xs font-medium dark:text-neutral-400 text-neutral-500 mb-1.5"
                      >
                        Apt, Suite, etc.
                        <span className="ml-1 font-normal dark:text-neutral-600 text-neutral-400">(optional)</span>
                      </label>
                      <input
                        id="addressLine2"
                        name="addressLine2"
                        type="text"
                        {...register('addressLine2')}
                        placeholder="Apt 4B"
                        autoComplete="address-line2"
                        className={inputCls}
                      />
                    </div>

                    {/* City / State / ZIP */}
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="city"
                          className="block text-xs font-medium dark:text-neutral-400 text-neutral-500 mb-1.5"
                        >
                          City *
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          {...register('city')}
                          placeholder="Lynn"
                          autoComplete="address-level2"
                          className={inputCls}
                          aria-invalid={!!errors?.city}
                        />
                        {errors?.city && (
                          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors?.city.message}</p>
                        )}
                      </div>

                      <div className="col-span-1">
                        <label
                          htmlFor="state"
                          className="block text-xs font-medium dark:text-neutral-400 text-neutral-500 mb-1.5"
                        >
                          State *
                        </label>
                        <select
                          id="state"
                          name="state"
                          {...register('state')}
                          autoComplete="address-level1"
                          className={inputCls}
                          aria-invalid={!!errors?.state}
                        >
                          <option value="" disabled>
                            —
                          </option>
                          {US_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {errors?.state && (
                          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors?.state.message}</p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="zipPostalCode"
                          className="block text-xs font-medium dark:text-neutral-400 text-neutral-500 mb-1.5"
                        >
                          ZIP Code *
                        </label>
                        <input
                          id="zipPostalCode"
                          name="zipPostalCode"
                          type="text"
                          inputMode="numeric"
                          {...register('zipPostalCode')}
                          placeholder="01901"
                          autoComplete="postal-code"
                          maxLength={10}
                          className={inputCls}
                          aria-invalid={!!errors?.zipPostalCode}
                        />
                        {errors?.zipPostalCode && (
                          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors?.zipPostalCode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-2.5 text-sm font-medium dark:text-neutral-400 text-neutral-500 dark:hover:text-white hover:text-neutral-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-sky-600/20"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Check className="w-4 h-4" aria-hidden="true" />
                      )}
                      {isSubmitting ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
