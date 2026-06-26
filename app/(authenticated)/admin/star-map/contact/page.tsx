import { StarMapContactClient } from '@/app/components/pages/StarMapContactClient'
import { getPageBySlug } from '@/app/lib/actions/page/getPageBySlug'

export default async function StarMapContactPage() {
  const data = await getPageBySlug('contact')
  return <StarMapContactClient data={data} />
}
