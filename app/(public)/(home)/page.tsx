import HomeClient from '@/app/(public)/(home)/HomeClient'
import { getHomePageData } from '@/lib/actions/_infra/getHomePageData'

export default async function HomePage() {
  const result = await getHomePageData()

  if (!result.data) throw new Error(result.error ?? 'Could not load the home page')

  const { pageContent, programs, hero } = result.data

  return <HomeClient pageContent={pageContent} programs={programs} hero={hero} />
}
