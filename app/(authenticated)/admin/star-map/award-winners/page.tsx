import { StarMapAwardWinnersClient } from '@/components/pages/StarMapAwardWinnersClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapAwardWinnersPage() {
  const data = await getPageBySlug('award-winner')
  return <StarMapAwardWinnersClient data={data} />
}
