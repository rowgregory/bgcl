import { PublicEventsClient } from '@/app/(public)/events/PublicEventsClient'
import { getActiveEvents } from '@/lib/actions/event/getActiveEvents'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PublicEventsPage() {
  const [events, pageData] = await Promise.all([getActiveEvents(), getPageBySlugClient('event')])
  return <PublicEventsClient events={events.data} pageData={pageData} />
}
