import { StarMapAwardWinnersClient } from '@/app/components/pages/StarMapAwardWinnersClient'
import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'

export default async function StarMapAwardWinnersPage() {
  const data = await getPageBySlug('award-winner')
  return <StarMapAwardWinnersClient data={data} />
}
