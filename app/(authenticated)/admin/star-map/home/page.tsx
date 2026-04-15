import { StarMapHomeClient } from '@/app/components/pages/StarMapHomeClient'
import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'

export default async function StarMapHomePage() {
  const data = await getPageBySlug('home')
  return <StarMapHomeClient data={data} />
}
