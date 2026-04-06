import { PublicEventsClient } from '@/app/components/pages/PublicEventsClient'
import { getActiveEvents } from '@/app/lib/actions/getActiveEvents'
import { getPageBySlugClient } from '@/app/lib/actions/getPageBySlugClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PublicEventsPage() {
  const [events, pageData] = await Promise.all([getActiveEvents(), getPageBySlugClient('event')])
  return <PublicEventsClient events={events.data} pageData={pageData} />
}
