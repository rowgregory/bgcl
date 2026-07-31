import { AdminListPage } from '@/components/admin/layout/AdminList'
import { getCampaigns } from '@/lib/actions/campaign/getCampaigns'

export const metadata = { title: 'Campaigns - Admin' }

export default async function CampaignsPage() {
  const data = await getCampaigns()
  return <AdminListPage data={data} pageTitle="Campaigns" itemType="campaign" />
}
