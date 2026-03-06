import SupporterSavedCardsClient from '@/app/components/pages/SupporterSavedCardsClient'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'

export const dynamic = 'force-dynamic'

export default async function SupporterSavedCardsPage() {
  const savedPaymentMethods = await getSavedPaymentMethods()
  return <SupporterSavedCardsClient cards={savedPaymentMethods} />
}
