import HomeClient from './components/pages/HomeClient'
import { getPageBySlug } from './lib/actions/getPageBySlug'
import { getPrograms } from './lib/actions/getPrograms'

export default async function Home() {
  const pageData = await getPageBySlug('home')
  const programs = await getPrograms()
  return <HomeClient initialPageData={pageData} programs={programs} />
}
