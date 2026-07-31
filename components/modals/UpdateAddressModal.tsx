'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Loader2, Check } from 'lucide-react'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { store, useUiSelector } from '@/lib/store/store'
import { showToast } from '@/lib/store/slices/toastSlice'
import { US_STATES } from '@/lib/constants/states'
import { setCloseUpdateAddressModal } from '@/lib/store/slices/uiSlice'
import { useRouter } from 'next/navigation'

const inputClass = `
  w-full px-3.5 py-2.5 text-sm rounded-xl border
  dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500
  bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400
  focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all
`

interface AddressForm {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipPostalCode: string
  country: string
}

function validate(form, setErrors): boolean {
  const newErrors: Partial<AddressForm> = {}
  if (!form?.addressLine1.trim()) newErrors.addressLine1 = 'Required'
  if (!form?.city.trim()) newErrors.city = 'Required'
  if (!form?.state) newErrors.state = 'Required'
  if (!form?.zipPostalCode.trim()) newErrors.zipPostalCode = 'Required'
  else if (!/^\d{5}(-\d{4})?$/.test(form?.zipPostalCode)) newErrors.zipPostalCode = 'Invalid ZIP'
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export function UpdateAddressModal() {
  const router = useRouter()
  const { address, addressModal } = useUiSelector()
  const [form, setForm] = useState<AddressForm>()
  const [errors, setErrors] = useState<Partial<AddressForm>>({})
  const [saving, setSaving] = useState(false)
  const onClose = () => store.dispatch(setCloseUpdateAddressModal())

  useEffect(() => {
    if (address) {
      setForm({
        addressLine1: address?.addressLine1 ?? '',
        addressLine2: address?.addressLine2 ?? '',
        city: address?.city ?? '',
        state: address?.state ?? '',
        zipPostalCode: address?.zipPostalCode ?? '',
        country: address?.country ?? 'US'
      })
    }
  }, [address])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof AddressForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSave() {
    if (!validate(form, setErrors)) return
    setSaving(true)

    try {
      await updateAddress({
        addressLine1: form?.addressLine1.trim(),
        addressLine2: form?.addressLine2.trim() || null,
        city: form?.city.trim(),
        state: form?.state,
        zipPostalCode: form?.zipPostalCode.trim(),
        country: form?.country || 'US'
      })

      store.dispatch(
        showToast({
          type: 'success',
          message: 'Address Updated!',
          description: `${form?.addressLine1}, ${form?.city}, ${form?.state} ${form?.zipPostalCode}`
        })
      )

      router.refresh()
      onClose()
    } catch (error) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Failed to Update Address',
          description: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
        })
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {addressModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

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
                    value={form?.addressLine1 ?? ''}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    autoComplete="address-line1"
                    autoFocus
                    className={inputClass}
                    aria-invalid={!!errors?.addressLine1}
                  />
                  {errors?.addressLine1 && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors?.addressLine1}</p>
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
                    value={form?.addressLine2 ?? ''}
                    onChange={handleChange}
                    placeholder="Apt 4B"
                    autoComplete="address-line2"
                    className={inputClass}
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
                      value={form?.city ?? ''}
                      onChange={handleChange}
                      placeholder="Lynn"
                      autoComplete="address-level2"
                      className={inputClass}
                      aria-invalid={!!errors?.city}
                    />
                    {errors?.city && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors?.city}</p>}
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
                      value={form?.state ?? ''}
                      onChange={handleChange}
                      autoComplete="address-level1"
                      className={inputClass}
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
                    {errors?.state && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors?.state}</p>}
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
                      value={form?.zipPostalCode ?? ''}
                      onChange={handleChange}
                      placeholder="01901"
                      autoComplete="postal-code"
                      maxLength={10}
                      className={inputClass}
                      aria-invalid={!!errors?.zipPostalCode}
                    />
                    {errors?.zipPostalCode && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors?.zipPostalCode}</p>
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
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-sky-600/20"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  )}
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
