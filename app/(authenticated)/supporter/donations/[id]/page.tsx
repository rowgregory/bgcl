import SupporterSubscriptionsClient from '@/components/pages/SupporterSubscriptionsClient'
import { getSubscriptionDetails } from '@/lib/actions/stripe/getSubscriptionDetails'

export default async function SupporterSubscriptionsPage({ params }) {
  const { id } = await params
  const data = await getSubscriptionDetails(id)
  return <SupporterSubscriptionsClient data={data} />
}
