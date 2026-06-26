import { AdminLayoutClient } from '@/app/components/pages/AdminLayoutClient'
import { getModalToggleState } from '@/app/lib/actions/getModalToggleState'
import { getThemes } from '@/app/lib/actions/theme/getThemes'

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const themes = await getThemes()
  const isModalEnabled = await getModalToggleState('home')
  return (
    <AdminLayoutClient themes={themes} isModalEnabled={isModalEnabled}>
      {children}
    </AdminLayoutClient>
  )
}
