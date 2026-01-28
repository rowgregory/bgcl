import { ICampaign } from '@/types/entities/campaign'

const CampaignSelectionAndNotes = ({ campaign, campaigns, setCampaign, notes, setNotes }) => {
  return (
    <div>
      <div className="pt-4 dark:border-zinc-700 border-t border-neutral-200">
        <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">
          Donation Campaign (optional)
        </label>
        <select
          value={campaign?.id ?? ''}
          onChange={(e) => {
            const selectedCampaign = campaigns?.find((c: ICampaign) => c.id === e.target.value)
            setCampaign(selectedCampaign || null)
          }}
          className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        >
          <option value="">Select a campaign</option>
          {campaigns?.map((c: ICampaign) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Donor Notes */}
      <div className="pt-4 dark:border-zinc-700 border-t border-neutral-200">
        <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">Message (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500 resize-none"
          placeholder="Share your reason for giving or leave a special message..."
          rows={3}
        />
      </div>
    </div>
  )
}

export default CampaignSelectionAndNotes
