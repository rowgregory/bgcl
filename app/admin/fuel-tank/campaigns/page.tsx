import { AdminListPage } from '@/app/components/admin/AdminList'
import { getCampaigns } from '@/app/lib/actions/getCampaigns'

export const metadata = { title: 'Campaigns - Admin' }

export default async function CampaignsPage() {
  const data = await getCampaigns()

  return <AdminListPage data={data} pageTitle="Campaigns" itemType="campaign" />
}
