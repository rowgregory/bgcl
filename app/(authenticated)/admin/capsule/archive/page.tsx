import CapsuleArchiveClient from '@/app/components/pages/CapsuleArchiveClient'
import { getArchivedEvents } from '@/app/lib/actions/getArchivedEvents'

export default async function CapsuleArchivePage() {
  const data = await getArchivedEvents()
  return <CapsuleArchiveClient data={data} />
}
