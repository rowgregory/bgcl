import { StarMapGetInvolvedClient } from '@/app/components/pages/StarMapGetInvolvedClient'
import { getPageBySlug } from '@/app/lib/actions/page/getPageBySlug'

export default async function StarMapGetInvolvedPage() {
  const data = await getPageBySlug('get-involved')
  return <StarMapGetInvolvedClient data={data} />
}
