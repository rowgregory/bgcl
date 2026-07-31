import { StarMapTeamClient } from '@/components/pages/StarMapTeamClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapTeamPage() {
  const data = await getPageBySlug('team')
  return <StarMapTeamClient data={data} />
}
