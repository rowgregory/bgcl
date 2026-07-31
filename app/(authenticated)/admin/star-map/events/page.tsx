import { StarMapEventsClient } from '@/components/pages/StarMapEventsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapEventsPage() {
  const data = await getPageBySlug('event')
  return <StarMapEventsClient data={data} />
}
