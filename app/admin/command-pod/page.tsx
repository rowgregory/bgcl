import { CommandPodClient } from '@/app/components/pages/CommandPodClient'
import { getAllUsers } from '@/app/lib/actions/getAdminData'

export default async function CommandPodPage() {
  const response = await getAllUsers()
  return <CommandPodClient users={response.data.users} />
}
