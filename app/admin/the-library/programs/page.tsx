import { AdminListPage } from '@/app/components/admin/AdminList'
import { getPrograms } from '@/app/lib/actions/getPrograms'

export const metadata = { title: 'Programs - Admin' }

export default async function ProgramsPage() {
  const data = await getPrograms()
  return <AdminListPage data={data} pageTitle="Programs" itemType="program" />
}
