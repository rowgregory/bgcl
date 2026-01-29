import SavedCardsClient from '@/app/components/pages/SavedCardsClient'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'
import { auth } from '@/app/lib/auth'

export const dynamic = 'force-dynamic'

export default async function SavedCardsPage() {
  const session = await auth()
  const savedPaymentMethods = await getSavedPaymentMethods(session.user.id)
  return <SavedCardsClient cards={savedPaymentMethods} />
}
