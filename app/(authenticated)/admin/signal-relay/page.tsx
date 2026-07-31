import SignalRelayClient from '@/components/pages/SignalRelayClient'
import { getSubscribers } from '@/lib/actions/subscriber/getSubscribers'

export default async function SignalRelayPage() {
  const subscribers = await getSubscribers()
  return <SignalRelayClient subscribers={subscribers} />
}
