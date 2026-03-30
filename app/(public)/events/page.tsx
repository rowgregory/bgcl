export const dynamic = 'force-dynamic'
export const revalidate = 0

import { PublicEventsClient } from '@/app/components/pages/PublicEventsClient'
import { getActiveEvents } from '@/app/lib/actions/getActiveEvents'
import { notFound } from 'next/navigation'

export default async function PublicEventsPage() {
  const result = await getActiveEvents()
  if (!result.success) notFound()

  return <PublicEventsClient events={result.data} />
}
