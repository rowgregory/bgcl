import { AdminHeroClient } from '@/components/pages/AdminHeroClient'
import { getCampaignIds } from '@/lib/actions/campaign/getCampaignIds'
import { getEventIds } from '@/lib/actions/event/getEventIds'
import { getHero } from '@/lib/actions/hero/getHero'

export default async function AdminHeroPage() {
  const [hero, eventIds, campaignIds] = await Promise.all([getHero(), getEventIds(), getCampaignIds()])

  return (
    <AdminHeroClient hero={hero?.data ?? null} eventIds={eventIds?.data ?? []} campaignIds={campaignIds?.data ?? []} />
  )
}
