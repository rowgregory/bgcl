import { CommandPodClient } from '@/components/pages/CommandPodClient'
import { getUsers } from '@/lib/actions/user/getUsers'

export default async function CommandPodPage() {
  const users = await getUsers()
  return <CommandPodClient users={users} />
}
