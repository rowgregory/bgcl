import PublicGetInvolvedClient from '@/app/(public)/get-involved/PublicGetInvolvedClient'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

export default async function PublicGetInvolvedPage() {
  const [pageData] = await Promise.all([getPageBySlugClient('get-involved')])
  return <PublicGetInvolvedClient pageData={pageData} />
}
