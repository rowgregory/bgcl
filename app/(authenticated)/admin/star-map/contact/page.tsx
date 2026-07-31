import { StarMapContactClient } from '@/components/pages/StarMapContactClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapContactPage() {
  const data = await getPageBySlug('contact')
  return <StarMapContactClient data={data} />
}
