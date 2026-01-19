import { getPageBySlug } from '@/app/lib/actions/getPageBySlug'
import HomePage from './page'
import { homeTextData } from '@/app/lib/mock-data/home-page'

export default async function HomeLayout() {
  const data = await getPageBySlug('home')
  return <HomePage data={data || homeTextData} />
}
