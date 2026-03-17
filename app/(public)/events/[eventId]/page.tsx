import { PublicEventDetailsClient } from '@/app/components/pages/PublicEventDetailsClient'
import { getEventById } from '@/app/lib/actions/getEventById'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const data = await getEventById(eventId)
  return <PublicEventDetailsClient data={data} />
}
