import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getClubResources } from '@/lib/actions/club-resource/getClubResources'

export const metadata = { title: 'Club Resources - Admin' }

export default async function ClubResourcePage() {
  const data = await getClubResources()
  return <AdminListPage data={data} pageTitle="Club Resources" itemType="club-resource" />
}
