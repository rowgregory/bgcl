import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getResources } from '@/lib/actions/resource/getResources'

export const metadata = { title: 'Resources - Admin' }

export default async function ResourcePage() {
  const result = await getResources()
  return <AdminListPage data={result.data} pageTitle="Resources" itemType="resource" />
}
