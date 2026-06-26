import { CapsuleTransactionsClient } from '@/app/components/pages/CapsuleTransactionsClient'
import { getCapsuleTransactions } from '@/app/lib/actions/_dashboard/getCapsuleTransactions'

export default async function CapsuleTransactionsPage() {
  const data = await getCapsuleTransactions()
  return <CapsuleTransactionsClient data={data} />
}
