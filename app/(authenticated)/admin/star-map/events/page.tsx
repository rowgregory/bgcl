import { StarMapEventsClient } from '@/app/components/pages/StarMapEventsClient'
import { getPageBySlug } from '@/app/lib/actions/page/getPageBySlug'

export default async function StarMapEventsPage() {
  const data = await getPageBySlug('event')
  return <StarMapEventsClient data={data} />
}
