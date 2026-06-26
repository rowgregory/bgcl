import { getUpcomingOrOngoingEvent } from '@/app/lib/actions/event/getUpcomingOrOngoingEvent'
import SupporterPage from './page'

export default async function SupporterLayout({ children }) {
  const result = await getUpcomingOrOngoingEvent()
  return <SupporterPage result={result}>{children}</SupporterPage>
}
