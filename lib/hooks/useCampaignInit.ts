import { ICampaign } from '@/types/entities/campaign'
import { useEffect } from 'react'
import { setDonateCheckoutForm as setForm } from '../utils/setDonateCheckoutForm'

export function useCampaignInit(campaignName: string | undefined, campaigns: ICampaign[]) {
  useEffect(() => {
    if (!campaigns?.length) return

    const found = campaignName ? (campaigns.find((c) => c.name === campaignName) ?? campaigns[0]) : campaigns[0]

    setForm({ campaign: found })
  }, [campaignName, campaigns])
}
