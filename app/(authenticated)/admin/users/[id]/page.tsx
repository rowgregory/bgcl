import { notFound } from 'next/navigation'
import { getUserForAdmin } from '@/lib/actions/user/getUserForAdmin'
import { UserDetailsClient } from './UserDetailsClient'

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const result = await getUserForAdmin(id)

  if (!result.success || !result.data) notFound()

  return <UserDetailsClient user={result.data} />
}
