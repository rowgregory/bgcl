import { UsersClient } from '@/app/(authenticated)/admin/users/UsersClient'
import { getUsers } from '@/lib/actions/user/getUsers'
import UserDrawer from './_components/UserDrawer'

export default async function UsersPage() {
  const result = await getUsers()
  return (
    <>
      <UserDrawer />
      <UsersClient users={result.data} />
    </>
  )
}
