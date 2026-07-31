import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'
import { CITClient } from './CITClient'

export default async function CITPage() {
  const pageData = await getPageBySlugClient('cit')
  return <CITClient t={pageData.sections.cit} />
}
