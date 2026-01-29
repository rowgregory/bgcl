import SubscriptionClient from '@/app/components/pages/SubscriptionClient'
import { getSubscriptionDetails } from '@/app/lib/actions/getSubscriptionDetails'

export default async function Subscription({ params }) {
  const { id } = await params
  const data = await getSubscriptionDetails(id)
  return <SubscriptionClient data={data} />
}
