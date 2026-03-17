import PublicCheckoutClient from '@/app/components/pages/PublicCheckoutClient'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'

export default async function PublicCheckoutPage() {
  const result = await getSavedPaymentMethods()
  return <PublicCheckoutClient savedCards={result?.data} />
}
