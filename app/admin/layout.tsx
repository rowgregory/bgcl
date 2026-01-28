import AdminClient from '../components/pages/AdminClient'
import { getModalToggleState } from '../lib/actions/getModalToggleState'
import { getThemes } from '../lib/actions/getThemes'

export default async function AdminPage({ children }: { children: React.ReactNode }) {
  const themes = await getThemes()
  const isModalEnabled = await getModalToggleState('home')
  return (
    <AdminClient themes={themes} isModalEnabled={isModalEnabled}>
      {children}
    </AdminClient>
  )
}
