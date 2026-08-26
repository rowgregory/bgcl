import AboutClient from '@/app/(public)/about/AboutClient'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'
import { getPrograms } from '@/lib/actions/program/getPrograms'

export default async function PublicAboutPage() {
  const [pageData, programs] = await Promise.all([getPageBySlugClient('about'), getPrograms()])
  return <AboutClient initialPageData={pageData} programs={programs.data} />
}
