import { UsersClient } from '@/app/(authenticated)/admin/users/UsersClient'
import { getUsers } from '@/lib/actions/user/getUsers'
import { notFound } from 'next/navigation'

export default async function UsersPage() {
  const result = await getUsers()

  if (!result.success || !result.data) notFound()

  return <UsersClient users={result.data} />
}
