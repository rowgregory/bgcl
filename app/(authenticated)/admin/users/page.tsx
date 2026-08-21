import { UsersClient } from '@/app/(authenticated)/admin/users/UsersClient'
import { getUsers } from '@/lib/actions/user/getUsers'

export default async function UsersPage() {
  const result = await getUsers()
  return <UsersClient users={result.data} />
}
