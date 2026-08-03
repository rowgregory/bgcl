import { useEffect } from 'react'
import { setDonateCheckoutForm as setForm } from '../utils/setDonateCheckoutForm'
import { CampaignWithCount } from '@/types/campaign.types'

export function useCampaignInit(campaignName: string | undefined, campaigns: CampaignWithCount[]) {
  useEffect(() => {
    if (!campaigns?.length) return

    const found = campaignName ? (campaigns.find((c) => c.name === campaignName) ?? campaigns[0]) : campaigns[0]

    setForm({ campaign: found })
  }, [campaignName, campaigns])
}
