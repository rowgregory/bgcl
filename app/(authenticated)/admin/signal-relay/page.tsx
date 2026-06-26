import SignalRelayClient from '@/app/components/pages/SignalRelayClient'
import { getSubscribers } from '@/app/lib/actions/subscriber/getSubscribers'

export default async function SignalRelayPage() {
  const subscribers = await getSubscribers()
  return <SignalRelayClient subscribers={subscribers} />
}
