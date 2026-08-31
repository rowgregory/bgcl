'use client'

import { useId } from 'react'
import { useFormContext } from 'react-hook-form'

import type { CampaignWithCount } from '@/types/campaign.types'
import type { DonationFormInput } from '@/lib/validations/donation.validation'

const labelCls = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'
const fieldCls =
  'w-full px-4 py-3 text-[15px] bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all'

export function DonateCampaignSelectionAndNotes({ campaigns }: { campaigns: CampaignWithCount[] }) {
  const { register } = useFormContext<DonationFormInput>()

  const campaignId = useId()
  const notesId = useId()

  return (
    <fieldset className="border-0 p-0 m-0 space-y-5">
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Your donation</p>
      <div>
        <label htmlFor={campaignId} className={labelCls}>
          Where should this go?
        </label>

        <select id={campaignId} className={fieldCls} {...register('campaignId')}>
          <option value="">Where it&apos;s needed most</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={notesId} className={labelCls}>
          Leave a message <span className="text-neutral-400 dark:text-neutral-600 font-normal">(optional)</span>
        </label>

        <textarea
          id={notesId}
          rows={3}
          className={`${fieldCls} resize-none`}
          placeholder="Share why you're giving, or a note for the club"
          {...register('notes')}
        />
      </div>
    </fieldset>
  )
}
