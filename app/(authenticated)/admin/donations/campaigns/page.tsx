import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getCampaigns } from '@/lib/actions/campaign/getCampaigns'

export const metadata = { title: 'Campaigns - Admin' }

export default async function DonationsCampaignsPage() {
  const data = await getCampaigns()
  return <AdminListPage data={data} pageTitle="Campaigns" itemType="campaign" />
}
