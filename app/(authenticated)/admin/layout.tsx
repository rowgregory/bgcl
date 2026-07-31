import { AdminLayoutClient } from '@/components/pages/AdminLayoutClient'
import { getModalToggleState } from '@/lib/actions/page/getModalToggleState'
import { getThemes } from '@/lib/actions/theme/getThemes'

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const themes = await getThemes()
  const isModalEnabled = await getModalToggleState('home')
  return (
    <AdminLayoutClient themes={themes} isModalEnabled={isModalEnabled}>
      {children}
    </AdminLayoutClient>
  )
}
