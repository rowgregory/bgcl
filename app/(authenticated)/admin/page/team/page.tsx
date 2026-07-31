import { PageEditorTeamClient } from '@/app/(authenticated)/admin/page/team/PageEditorTeamClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorTeamPage() {
  const data = await getPageBySlug('team')
  return <PageEditorTeamClient data={data} />
}
