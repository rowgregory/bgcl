import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getCampaigns } from '@/lib/actions/campaign/getCampaigns'
import { CampaignDrawer } from '../_components/CampaignDrawer'

export const metadata = { title: 'Campaigns - Admin' }

export default async function DonationsCampaignsPage() {
  const result = await getCampaigns()
  return (
    <>
      <CampaignDrawer />
      <AdminListPage data={result.data} pageTitle="Campaigns" itemType="campaign" />
    </>
  )
}
