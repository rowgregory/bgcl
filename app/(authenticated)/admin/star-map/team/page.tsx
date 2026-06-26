import { StarMapTeamClient } from '@/app/components/pages/StarMapTeamClient'
import { getPageBySlug } from '@/app/lib/actions/page/getPageBySlug'

export default async function StarMapTeamPage() {
  const data = await getPageBySlug('team')
  return <StarMapTeamClient data={data} />
}
