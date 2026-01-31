import HomeClient from './components/pages/HomeClient'
import { getPageBySlugClient } from './lib/actions/getPageBySlugClient'
import { getPrograms } from './lib/actions/getPrograms'

export default async function Home() {
  const pageData = await getPageBySlugClient('home')
  const programs = await getPrograms()
  return <HomeClient initialPageData={pageData} programs={programs} />
}
