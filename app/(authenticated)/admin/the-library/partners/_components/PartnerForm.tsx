'use client'

import { motion } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { usePartnerDrawer } from '@/stores/drawers'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import ImageUpload from '@/components/_shared/ImageUpload'
import { PARTNER_TIERS, type PartnerFormInput } from '@/lib/validations/partner.validation'
import { inputCls, labelCls } from '@/lib/constants/form.constants'

export default function PartnerForm({ isUpdating }: { isUpdating: boolean }) {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useFormContext<PartnerFormInput>()

  const close = usePartnerDrawer((s) => s.close)

  return (
    <div className="max-w-2xl w-full mx-auto p-6 md:p-8 pb-40">
      {/* Header */}
      <motion.div
        className="mb-8 space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">
          {isUpdating ? 'Edit Partner' : 'Create Partner'}
        </h1>
        <p className="dark:text-neutral-400 text-neutral-600">Add a sponsor or community partner</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelCls}>
              Partner Name{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              aria-invalid={!!errors.name}
              className={inputCls}
              placeholder="Enter partner name"
            />
            {errors.name && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Tier */}
          <div>
            <label htmlFor="tier" className={labelCls}>
              Tier
            </label>
            <select id="tier" {...register('tier')} aria-invalid={!!errors.tier} className={inputCls}>
              <option value="">Select a tier</option>
              {PARTNER_TIERS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.tier && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.tier.message}
              </p>
            )}
          </div>

          {/* External Link */}
          <div>
            <label htmlFor="externalLink" className={labelCls}>
              Website
            </label>
            <input
              id="externalLink"
              type="url"
              {...register('externalLink')}
              aria-invalid={!!errors.externalLink}
              className={inputCls}
              placeholder="https://example.com"
            />
            {errors.externalLink && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.externalLink.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className={labelCls}>
              Amount
            </label>
            <input id="amount" type="text" {...register('amount')} className={inputCls} placeholder="e.g. $5,000" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelCls}>
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Short description shown on the partners page"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className={labelCls}>
              Internal Notes
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={2}
              className={`${inputCls} resize-none`}
              placeholder="Not shown publicly"
            />
          </div>

          {/* Logo */}
          <ImageUpload fieldName="image" label="Logo" />
        </div>

        {/* Visibility */}
        <div className="space-y-3 dark:border-neutral-800 border-neutral-200 border-t pt-8">
          <FormSwitch name="isActive" label="Active" description="Show this partner on the public site" />
          <FormSwitch name="isFeatured" label="Featured" description="Highlight this partner above the others" />
        </div>
      </motion.div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-6 md:p-8 z-40">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <motion.button
            type="button"
            onClick={close}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-2 md:order-1 w-full md:flex-1 py-3 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:disabled:bg-neutral-800 bg-neutral-300 hover:bg-neutral-400 disabled:bg-neutral-200 text-neutral-900 dark:text-neutral-100 font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            form="partnerForm"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-1 md:order-2 w-full md:flex-1 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isUpdating ? 'Update Partner' : 'Create Partner'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
