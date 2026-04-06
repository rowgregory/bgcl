import { AdminHeroClient } from '@/app/components/pages/AdminHeroClient'
import { getCampaignIds } from '@/app/lib/actions/getCampaignIds'
import { getEventIds } from '@/app/lib/actions/getEventIds'
import { getHero } from '@/app/lib/actions/getHero'

export default async function AdminHeroPage() {
  const [hero, eventIds, campaignIds] = await Promise.all([getHero(), getEventIds(), getCampaignIds()])

  return (
    <AdminHeroClient hero={hero?.data ?? null} eventIds={eventIds?.data ?? []} campaignIds={campaignIds?.data ?? []} />
  )
}
