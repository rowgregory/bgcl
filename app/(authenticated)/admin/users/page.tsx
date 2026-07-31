import { UsersClient } from '@/app/(authenticated)/admin/users/UsersClient'
import { getUsers } from '@/lib/actions/user/getUsers'

export default async function UsersPage() {
  const users = await getUsers()
  return <UsersClient users={users} />
}
