import OrderConfirmationClient from '@/app/(public)/order-confirmation/[id]/OrderConfirmationClient'
import { getOrder } from '@/lib/actions/order/getOrder'

export default async function OrderConfirmationPage({ params }) {
  const { id } = await params
  const result = await getOrder(id)
  return <OrderConfirmationClient order={result.data} />
}
