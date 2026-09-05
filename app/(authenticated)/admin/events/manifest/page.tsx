import EventsManifestClient from '@/app/(authenticated)/admin/events/manifest/EventsManifestClient'
import { getEventsManifest } from '@/lib/actions/_dashboard/getEventsManifest'

export default async function EventsManifestPage() {
  const result = await getEventsManifest()
  return <EventsManifestClient data={result.data} />
}
