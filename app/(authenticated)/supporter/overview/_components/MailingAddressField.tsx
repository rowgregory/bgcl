'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { deleteAddress } from '@/lib/actions/address/deleteAddress'
import { AddressFormInput, AddressFormValues, addressSchema, EMPTY_ADDRESS } from '@/lib/validations/address.validation'
import { US_STATES } from '@/lib/constants/states'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'

const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600'
const fieldCls =
  'w-full px-2.5 py-1.5 text-[13px] bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all'
const actionCls =
  'text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1'
const errCls = 'mt-1 text-[11px] text-red-600 dark:text-red-400'

export function MailingAddressField({ address }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<InlineMessageState | null>(null)

  const hasAddress = Boolean(address?.addressLine1)

  const methods = useForm<AddressFormInput, unknown, AddressFormValues>({
    resolver: zodResolver(addressSchema),
    mode: 'onTouched',
    defaultValues: address
      ? {
          addressLine1: address.addressLine1 ?? '',
          addressLine2: address.addressLine2 ?? '',
          city: address.city ?? '',
          state: address.state ?? '',
          zipPostalCode: address.zipPostalCode ?? '',
          country: address.country ?? 'US'
        }
      : EMPTY_ADDRESS
  })

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = methods

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await updateAddress(values)

      if (!res.success) {
        setError('root', { message: res.error })
        return
      }

      setEditing(false)
      router.refresh()
    } catch {
      setError('root', { message: 'Could not save your address. Please try again.' })
    }
  })

  const handleCancel = () => {
    setEditing(false)
    setMessage(null)
    reset()
  }

  const handleDelete = async () => {
    setMessage(null)
    setDeleting(true)

    try {
      const res = await deleteAddress()

      if (res && res.success === false) {
        setMessage({
          type: 'error',
          message: 'Could not remove your address',
          description: extractErrorMessage(res)
        })
        return
      }

      reset(EMPTY_ADDRESS)
      router.refresh()
    } catch (error) {
      setMessage({
        type: 'error',
        message: 'Could not remove your address',
        description: extractErrorMessage(error)
      })
    } finally {
      setDeleting(false)
    }
  }

  const lines = hasAddress
    ? [
        address.addressLine1,
        address.addressLine2,
        [address.city, address.state, address.zipPostalCode].filter(Boolean).join(', ')
      ].filter(Boolean)
    : []

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-3" />

      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-6 min-w-0 flex-1">
          <span className={`${dtCls} w-16 shrink-0`}>Address</span>

          {editing ? (
            <FormProvider {...methods}>
              <form noValidate id="addressForm" className="w-full max-w-sm">
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-5">
                    <input
                      type="text"
                      {...register('addressLine1')}
                      placeholder="Street address"
                      aria-label="Street address"
                      autoComplete="address-line1"
                      autoFocus
                      aria-invalid={!!errors?.addressLine1}
                      className={fieldCls}
                    />
                    {errors?.addressLine1 && <p className={errCls}>{errors.addressLine1.message}</p>}
                  </div>

                  <div className="col-span-5">
                    <input
                      type="text"
                      {...register('addressLine2')}
                      placeholder="Apt, suite (optional)"
                      aria-label="Apartment or suite"
                      autoComplete="address-line2"
                      className={fieldCls}
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="City"
                      aria-label="City"
                      autoComplete="address-level2"
                      aria-invalid={!!errors?.city}
                      className={fieldCls}
                    />
                    {errors?.city && <p className={errCls}>{errors.city.message}</p>}
                  </div>

                  <div className="col-span-1">
                    <select
                      {...register('state')}
                      aria-label="State"
                      autoComplete="address-level1"
                      aria-invalid={!!errors?.state}
                      className={fieldCls}
                    >
                      <option value="" disabled>
                        ST
                      </option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors?.state && <p className={errCls}>{errors.state.message}</p>}
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      {...register('zipPostalCode')}
                      placeholder="ZIP"
                      aria-label="ZIP code"
                      autoComplete="postal-code"
                      aria-invalid={!!errors?.zipPostalCode}
                      className={`${fieldCls} tabular-nums`}
                    />
                    {errors?.zipPostalCode && <p className={errCls}>{errors.zipPostalCode.message}</p>}
                  </div>
                </div>

                {errors?.root && <p className={errCls}>{errors.root.message}</p>}
              </form>
            </FormProvider>
          ) : hasAddress ? (
            <div className="min-w-0">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={`text-[13px] truncate ${
                    i === 0 ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-neutral-400 dark:text-neutral-600">Not set</p>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {editing ? (
            <>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className={`${actionCls} text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300`}
              >
                {isSubmitting ? 'Saving…' : 'Save'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white`}
              >
                Cancel
              </button>
            </>
          ) : hasAddress ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setMessage(null)
                  setEditing(true)
                }}
                disabled={deleting}
                aria-label="Edit mailing address"
                className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white`}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                aria-label="Remove mailing address"
                className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400`}
              >
                {deleting ? 'Removing…' : 'Remove'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMessage(null)
                setEditing(true)
              }}
              aria-label="Add mailing address"
              className={`${actionCls} text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300`}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
