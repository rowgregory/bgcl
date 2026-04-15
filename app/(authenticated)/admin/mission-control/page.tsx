import { MissionControlClient } from '@/app/components/pages/MissionControlClient'
import getGoogleAnalyticsCredentials from '@/app/lib/actions/getGoogleAnalyticsCredentials'
import { getStripeCredentials } from '@/app/lib/actions/getStripeCredentials'

export default async function MissionControlPage() {
  const stripeCredentials = await getStripeCredentials()
  const googleAnalyticsCredentials = await getGoogleAnalyticsCredentials()
  const credentials = {
    stripeCredentials,
    googleAnalyticsCredentials
  }
  return <MissionControlClient credentials={credentials} />
}
