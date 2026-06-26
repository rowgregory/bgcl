import { StarMapProgramsClient } from '@/app/components/pages/StarMapProgramsClient'
import { getPageBySlug } from '@/app/lib/actions/page/getPageBySlug'

export default async function StarMapProgramsPage() {
  const data = await getPageBySlug('program')
  return <StarMapProgramsClient data={data} />
}
