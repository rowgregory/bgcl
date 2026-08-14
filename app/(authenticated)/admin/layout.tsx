import AdminLayoutClient from '@/app/(authenticated)/admin/AdminLayoutClient'
import { getModalToggleState } from '@/lib/actions/page/getModalToggleState'
import { getThemes } from '@/lib/actions/theme/getThemes'

export const dynamic = 'force-dynamic'

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const [themes, modalState] = await Promise.all([getThemes(), getModalToggleState('home')])

  return (
    <AdminLayoutClient themes={themes.data ?? []} isModalEnabled={modalState}>
      {children}
    </AdminLayoutClient>
  )
}
