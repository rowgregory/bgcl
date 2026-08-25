import { AdminListPage } from '@/app/(authenticated)/admin/_components/AdminList'
import ProgramDrawer from './_components/ProgramDrawer'
import { getPrograms } from '@/lib/actions/program/getPrograms'
import { getThemes } from '@/lib/actions/theme/getThemes'

export const metadata = { title: 'Programs - Admin' }

export default async function ProgramsPage() {
  const [result, themes] = await Promise.all([getPrograms(), getThemes()])

  return (
    <>
      <AdminListPage data={result.data} pageTitle="Programs" itemType="program" />
      <ProgramDrawer themes={themes.data} />
    </>
  )
}
