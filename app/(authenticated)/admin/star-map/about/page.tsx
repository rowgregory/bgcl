import { StarMapAboutClient } from '@/components/pages/StarMapAboutClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapAboutPage() {
  const data = await getPageBySlug('about')
  return <StarMapAboutClient data={data} />
}
