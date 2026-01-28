import { StarMapAboutClient } from '@/app/components/pages/StarMapAboutClient'
import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'

export default async function HomePage() {
  const data = await getPageBySlug('about')
  return <StarMapAboutClient data={data} />
}
