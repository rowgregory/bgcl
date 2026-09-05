'use client'

import ImageUpload from '@/components/_shared/ImageUpload'
import { useFormContext } from 'react-hook-form'
import { CampaignFormInput } from '@/lib/validations/campaign.validation'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import { useCampaignDrawer } from '@/stores/drawers'

const labelCls = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'

const fieldCls =
  'w-full h-[52px] px-5 text-[15px] bg-transparent rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors'

const textareaCls =
  'w-full px-5 py-4 text-[15px] bg-transparent rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none'

const errorCls = 'mt-1.5 text-xs text-red-600 dark:text-red-400'

export default function CampaignForm({ isUpdating }: { isUpdating: boolean }) {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useFormContext<CampaignFormInput>()

  const close = useCampaignDrawer((s) => s.close)

  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="shrink-0 h-11 flex items-center px-5 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          {isUpdating ? 'Edit campaign' : 'New campaign'}
        </h2>
      </div>

      {/* Body */}
      <div id="campaignForm" className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name
          </label>
          <input id="name" type="text" {...register('name')} className={fieldCls} aria-invalid={!!errors.name} />
          {errors.name && (
            <p role="alert" className={errorCls}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className={labelCls}>
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Describe your campaign here."
            rows={4}
            className={textareaCls}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p role="alert" className={errorCls}>
              {errors.description.message}
            </p>
          )}
        </div>

        <ImageUpload fieldName="image" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="goalAmount" className={labelCls}>
              Goal amount
            </label>
            <input
              id="goalAmount"
              type="number"
              {...register('goalAmount')}
              className={`${fieldCls} tabular-nums`}
              aria-invalid={!!errors.goalAmount}
            />
            {errors.goalAmount && (
              <p role="alert" className={errorCls}>
                {errors.goalAmount.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="currentAmount" className={labelCls}>
              Current amount
            </label>
            <input
              id="currentAmount"
              type="number"
              {...register('currentAmount')}
              className={`${fieldCls} tabular-nums`}
              aria-invalid={!!errors.currentAmount}
            />
            {errors.currentAmount && (
              <p role="alert" className={errorCls}>
                {errors.currentAmount.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="organizerName" className={labelCls}>
            Organizer name
          </label>
          <input
            id="organizerName"
            type="text"
            {...register('organizerName')}
            className={fieldCls}
            aria-invalid={!!errors.organizerName}
          />
          {errors.organizerName && (
            <p role="alert" className={errorCls}>
              {errors.organizerName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="startDate" className={labelCls}>
              Start date
            </label>
            <input id="startDate" type="date" {...register('startDate')} className={fieldCls} aria-invalid={!!errors.startDate} />
            {errors.startDate && (
              <p role="alert" className={errorCls}>
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className={labelCls}>
              End date
            </label>
            <input id="endDate" type="date" {...register('endDate')} className={fieldCls} />
          </div>
        </div>

        <div>
          <label htmlFor="externalLink" className={labelCls}>
            External link
          </label>
          <input id="externalLink" type="text" {...register('externalLink')} className={fieldCls} placeholder="https://www..." />
        </div>

        <div className="space-y-3 pt-1">
          <FormSwitch label="Active campaign" description="Is your campaign actively accepting donations?" name="isActive" />
          <FormSwitch
            label="Listed campaign"
            description="Controls whether this campaign appears on the public campaigns page"
            name="isListed"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-5 py-3 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={close}
          disabled={isSubmitting}
          className="px-3 py-2 rounded text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          {isSubmitting ? 'Saving…' : isUpdating ? 'Update campaign' : 'Create campaign'}
        </button>
      </div>
    </div>
  )
}
