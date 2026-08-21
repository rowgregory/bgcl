import SupporterSubscriptionsClient from '@/app/(authenticated)/supporter/donations/[id]/SupporterSubscriptionsClient'
import { getSubscriptionDetails } from '@/lib/actions/stripe/getSubscriptionDetails'

export default async function SupporterSubscriptionsPage({ params }) {
  const { id } = await params
  const result = await getSubscriptionDetails(id)
  return <SupporterSubscriptionsClient data={result.data} />
}
