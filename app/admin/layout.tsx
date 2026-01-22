import AdminClient from '../components/pages/AdminClient'
import { getThemes } from '../lib/actions/getThemes'

export default async function AdminPage({ children }: { children: React.ReactNode }) {
  const themes = await getThemes()

  return <AdminClient themes={themes}>{children}</AdminClient>
}
