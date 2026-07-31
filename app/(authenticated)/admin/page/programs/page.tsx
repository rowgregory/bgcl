import { PageEditorProgramsClient } from '@/app/(authenticated)/admin/page/programs/PageEditorProgramsClient'
import { getPageBySlug } from '@/lib/actions/page/getPageBySlug'

export default async function PageEditorProgramsPage() {
  const data = await getPageBySlug('program')
  return <PageEditorProgramsClient data={data} />
}
