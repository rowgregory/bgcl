import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getPrograms } from '@/lib/actions/program/getPrograms'

export const metadata = { title: 'Programs - Admin' }

export default async function ProgramsPage() {
  const data = await getPrograms()
  return <AdminListPage data={data} pageTitle="Programs" itemType="program" />
}
