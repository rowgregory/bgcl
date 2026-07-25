import { AdminListPage } from '@/components/admin/layout/AdminList'
import { getClubResources } from '@/app/lib/actions/club-resource/getClubResources'

export const metadata = { title: 'Club Resources - Admin' }

export default async function ClubResourcePage() {
  const data = await getClubResources()
  return <AdminListPage data={data} pageTitle="Club Resources" itemType="club-resource" />
}
