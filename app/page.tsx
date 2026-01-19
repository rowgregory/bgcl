import HomeClient from './components/pages/HomeClient'
import { getPageBySlug } from './lib/actions/getPageBySlug'
import { getPrograms } from './lib/actions/getPrograms'
import { getTeamMembersByRole } from './lib/actions/getTeamMembersByRole'

export default async function Home() {
  const pageData = await getPageBySlug('home')
  const programs = await getPrograms()
  const youths = await getTeamMembersByRole('youth')
  const youth = youths[0]
  return <HomeClient initialPageData={pageData} programs={programs} youth={youth} />
}
