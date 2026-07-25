import AboutPageClient from '@/app/(public)/about/AboutClient'
import { getPageBySlugClient } from '@/app/lib/actions/page/getPageBySlugClient'

export default async function PublicAboutPage() {
  const pageData = await getPageBySlugClient('about')
  return <AboutPageClient initialPageData={pageData} />
}
