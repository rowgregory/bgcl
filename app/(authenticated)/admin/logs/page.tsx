import LogsClient from '@/components/pages/LogsClient'
import { getLogs } from '@/lib/actions/log/getLogs'
import { getLogStats } from '@/lib/actions/log/getLogStats'

export default async function LogsPage() {
  const logs = await getLogs()
  const stats = await getLogStats()
  return <LogsClient logs={logs} stats={stats} />
}
