import HomeClient from './components/pages/HomeClient'
import { getHero } from './lib/actions/getHero'
import { getPageBySlugClient } from './lib/actions/getPageBySlugClient'
import { getPrograms } from './lib/actions/getPrograms'

export default async function Home() {
  const [pageData, programs, hero] = await Promise.all([getPageBySlugClient('home'), getPrograms(), getHero()])
  return <HomeClient initialPageData={pageData} programs={programs} hero={hero?.data} />
}
