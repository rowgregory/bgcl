import AboutPageClient from '@/app/components/pages/AboutClient'
import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'

export default async function AboutPage() {
  const pageData = await getPageBySlug('about')
  return <AboutPageClient initalPageData={pageData?.content} />
}
