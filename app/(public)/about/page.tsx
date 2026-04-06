import AboutPageClient from '@/app/components/pages/AboutClient'
import { getPageBySlugClient } from '@/app/lib/actions/getPageBySlugClient'

export default async function PublicAboutPage() {
  const pageData = await getPageBySlugClient('about')
  return <AboutPageClient initialPageData={pageData} />
}
