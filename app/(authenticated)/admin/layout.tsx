import AdminLayoutClient from '@/app/(authenticated)/admin/AdminLayoutClient'
import { getModalToggleState } from '@/lib/actions/page/getModalToggleState'
import { auth } from '@/lib/auth/auth'

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const [session, modalToggleResult] = await Promise.all([auth(), getModalToggleState()])
  return (
    <AdminLayoutClient user={session.user} isModalEnabled={modalToggleResult.data}>
      {children}
    </AdminLayoutClient>
  )
}
