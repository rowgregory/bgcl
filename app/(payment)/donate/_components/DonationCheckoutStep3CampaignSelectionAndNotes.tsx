'use client'

import { useId } from 'react'
import { useFormContext } from 'react-hook-form'

import type { CampaignWithCount } from '@/types/campaign.types'
import type { DonationFormInput } from '@/lib/validations/donation.validation'

export const DonationCheckoutStep3CampaignSelectionAndNotes = ({ campaigns }: { campaigns: CampaignWithCount[] }) => {
  const { register } = useFormContext<DonationFormInput>()

  const campaignId = useId()
  const notesId = useId()

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
        Settings
      </legend>

      <div>
        <label htmlFor={campaignId} className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">
          Donation Campaign
        </label>
        <select
          id={campaignId}
          className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          {...register('campaignId')}
        >
          <option value="">Where it's needed most</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      {/* Donor Notes */}
      <div className="pt-4 dark:border-zinc-700 border-t border-neutral-200">
        <label htmlFor={notesId} className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">
          Message (Optional)
        </label>
        <textarea
          id={notesId}
          rows={3}
          className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500 resize-none"
          placeholder="Share your reason for giving or leave a special message..."
          {...register('notes')}
        />
      </div>
    </fieldset>
  )
}
