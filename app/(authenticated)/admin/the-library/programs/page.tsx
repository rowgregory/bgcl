import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import { getPrograms } from '@/lib/actions/program/getPrograms'

export const metadata = { title: 'Programs - Admin' }

export default async function ProgramsPage() {
  const result = await getPrograms()
  return <AdminListPage data={result.data} pageTitle="Programs" itemType="program" />
}
