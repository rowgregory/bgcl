import CapsuleManifestClient from '@/app/components/pages/CapsuleManifestClient'
import { getCapsuleTransactions } from '@/app/lib/actions/_dashboard/getCapsuleTransactions'

export default async function CapsuleManifestPage() {
  const data = await getCapsuleTransactions()
  return <CapsuleManifestClient data={data} />
}
