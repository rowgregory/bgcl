import { StarMapPartnershipsClient } from '@/app/components/pages/StarMapPartnershipsClient'
import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'

export default async function StarMapPartnershipsPage() {
  const data = await getPageBySlug('partner')
  return <StarMapPartnershipsClient data={data} />
}
