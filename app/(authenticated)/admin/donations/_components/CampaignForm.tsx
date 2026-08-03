'use client'

import { motion } from 'framer-motion'
import ImageUpload from '@/components/_shared/ImageUpload'
import { useFormContext } from 'react-hook-form'
import { CampaignFormInput } from '@/lib/validations/campaign.validation'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import { useCampaignDrawer } from '@/stores/drawers'

export default function CampaignForm({ isUpdating }: { isUpdating: boolean }) {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useFormContext<CampaignFormInput>()
  const close = useCampaignDrawer((s) => s.close)

  return (
    <div className="w-full mx-auto pb-40">
      {/* Header */}
      <motion.div
        className="space-y-2 px-8 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">
          {isUpdating ? 'Edit Campaign' : 'Create Campaign'}
        </h1>
        <p className="dark:text-neutral-400 text-neutral-600">Configure your campaign details</p>
      </motion.div>

      {/* Form */}
      <motion.div
        id="campaignForm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 space-y-8 h-[calc(100vh-249px)] overflow-y-auto"
      >
        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p role="alert">{errors.name.message}</p>}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              Description *
            </label>
            <textarea
              name="description"
              {...register('description')}
              placeholder="Describe your campaign here."
              rows={4}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
              aria-invalid={!!errors.description}
            />
            {errors?.description && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          <ImageUpload fieldName="image" />

          <div>
            <label
              htmlFor="goalAmount"
              className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2"
            >
              Goal Amount
            </label>
            <input
              type="number"
              name="goalAmount"
              {...register('goalAmount')}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder=""
            />
            {errors?.goalAmount && <p className="mt-2 text-sm text-red-400">{errors.goalAmount.message}</p>}
          </div>

          <div>
            <label
              htmlFor="currentAmount"
              className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2"
            >
              Current Amount
            </label>
            <input
              type="number"
              name="currentAmount"
              {...register('currentAmount')}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder=""
            />
            {errors?.currentAmount && <p className="mt-2 text-sm text-red-400">{errors.currentAmount.message}</p>}
          </div>

          <div>
            <label
              htmlFor="organizerName"
              className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2"
            >
              Organizer Name *{' '}
            </label>
            <input
              type="text"
              name="organizerName"
              {...register('organizerName')}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder=""
            />
            {errors?.organizerName && <p className="mt-2 text-sm text-red-400">{errors.organizerName.message}</p>}
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2"
            >
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              {...register('startDate')}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder=""
            />
            {errors?.startDate && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              {...register('endDate')}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder=""
            />
          </div>

          <FormSwitch
            label="Active Campaign"
            description="Is your campaign actively accepting donations?"
            name="isActive"
          />
          <FormSwitch
            label="Listed Campaign"
            description="Controls whether this campaign appears on the public campaigns page"
            name="isListed"
          />

          <div>
            <label
              htmlFor="externalLink"
              className="block text-sm font-medium dark:text-neutral-300 text-neutral-700 mb-2"
            >
              External Link
            </label>
            <input
              type="text"
              name="externalLink"
              {...register('externalLink')}
              className="w-full px-4 py-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder="https://www..."
            />
          </div>
        </div>

        {/* Required Fields Note */}
        <p className="text-xs dark:text-neutral-500 text-neutral-600 text-center">Fields marked with * are required</p>
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
          {/* Submit Button */}
          <motion.button
            form="campaignForm"
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-1 md:order-2 w-full md:flex-1 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isUpdating ? 'Update campaign' : 'Create campaign'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
