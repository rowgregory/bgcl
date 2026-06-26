import { StarMapAboutClient } from '@/app/components/pages/StarMapAboutClient'
import { getPageBySlug } from '@/app/lib/actions/page/getPageBySlug'

export default async function StarMapAboutPage() {
  const data = await getPageBySlug('about')
  return <StarMapAboutClient data={data} />
}
