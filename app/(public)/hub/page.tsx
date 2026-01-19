import HubClient from '@/app/components/pages/HubClient'
import { getNewslettersAndResources } from '@/app/lib/actions/getNewslettersAndResources'

export default async function HubPage() {
  const newslettersAndResources = await getNewslettersAndResources()
  return <HubClient newsletters={newslettersAndResources?.newsletters} resources={newslettersAndResources?.resources} />
}
