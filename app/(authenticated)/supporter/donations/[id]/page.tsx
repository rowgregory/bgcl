import SupporterSubscriptionsClient from '@/app/(authenticated)/supporter/donations/[id]/SupporterSubscriptionsClient'
import { getSubscriptionDetails } from '@/lib/actions/stripe/getSubscriptionDetails'

export default async function SupporterSubscriptionsPage({ params }) {
  const { id } = await params
  const data = await getSubscriptionDetails(id)
  return <SupporterSubscriptionsClient data={data} />
}
