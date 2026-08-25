import SupporterSubscriptionDetailsClient from '@/app/(authenticated)/supporter/donations/[id]/SupporterSubscriptionDetailsClient'
import { getSubscriptionDetails } from '@/lib/actions/stripe/getSubscriptionDetails'

export default async function SupporterSubscriptionsPage({ params }) {
  const { id } = await params
  const result = await getSubscriptionDetails(id)
  return <SupporterSubscriptionDetailsClient data={result.data} />
}
