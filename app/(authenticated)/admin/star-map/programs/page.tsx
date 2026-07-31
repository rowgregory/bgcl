import { StarMapProgramsClient } from '@/components/pages/StarMapProgramsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function StarMapProgramsPage() {
  const data = await getPageBySlug('program')
  return <StarMapProgramsClient data={data} />
}
