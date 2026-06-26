import LogsClient from '@/app/components/pages/LogsClient'
import { getLogs } from '@/app/lib/actions/log/getLogs'
import { getLogStats } from '@/app/lib/actions/log/getLogStats'

export default async function LogsPage() {
  const logs = await getLogs()
  const stats = await getLogStats()
  return <LogsClient logs={logs} stats={stats} />
}
