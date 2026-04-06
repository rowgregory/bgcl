import PublicGetInvolvedClient from '@/app/components/pages/PublicGetInvolvedClient'
import { getPageBySlugClient } from '@/app/lib/actions/getPageBySlugClient'

export default async function PublicGetInvolvedPage() {
  const [pageData] = await Promise.all([getPageBySlugClient('get-involved')])
  return <PublicGetInvolvedClient pageData={pageData} />
}
