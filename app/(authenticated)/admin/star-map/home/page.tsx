import { StarMapHomeClient } from '@/components/pages/StarMapHomeClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapHomePage() {
  const data = await getPageBySlug('home')
  return <StarMapHomeClient data={data} />
}
