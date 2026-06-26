import HomeClient from './components/pages/HomeClient'
import { getHero } from './lib/actions/hero/getHero'
import { getPageBySlugClient } from './lib/actions/page/getPageBySlugClient'
import { getPrograms } from './lib/actions/program/getPrograms'

export default async function Home() {
  const [pageData, programs, hero] = await Promise.all([getPageBySlugClient('home'), getPrograms(), getHero()])
  return <HomeClient initialPageData={pageData} programs={programs} hero={hero?.data} />
}
