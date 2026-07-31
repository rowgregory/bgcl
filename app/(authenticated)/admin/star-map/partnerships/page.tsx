import { StarMapPartnershipsClient } from '@/components/pages/StarMapPartnershipsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapPartnershipsPage() {
  const data = await getPageBySlug('partner')
  return <StarMapPartnershipsClient data={data} />
}
