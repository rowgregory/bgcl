import { CommandPodClient } from '@/app/components/pages/CommandPodClient'
import { getUsers } from '@/app/lib/actions/getUsers'

export default async function CommandPodPage() {
  const users = await getUsers()
  return <CommandPodClient users={users} />
}
