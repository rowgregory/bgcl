import { PageEditorAwardWinnersClient } from '@/app/(authenticated)/admin/page/award-winners/PageEditorAwardWinnersClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorAwardWinnersPage() {
  const data = await getPageBySlug('award-winner')
  return <PageEditorAwardWinnersClient data={data} />
}
