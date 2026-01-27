import SavedCardsClient from '@/app/components/pages/SavedCardsClient'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'

export const dynamic = 'force-dynamic'

export default async function SavedCardsPage() {
  const savedPaymentMethods = await getSavedPaymentMethods()
  return <SavedCardsClient cards={savedPaymentMethods} />
}
