import { PageEditorEventsClient } from '@/app/(authenticated)/admin/page/events/PageEditorEventsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorEventsPage() {
  const data = await getPageBySlug('event')
  return <PageEditorEventsClient data={data} />
}
