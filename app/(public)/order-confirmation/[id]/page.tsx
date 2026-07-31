import OrderConfirmationClient from '@/app/(public)/order-confirmation/[id]/OrderConfirmationClient'
import { getOrder } from '@/lib/actions/order/getOrder'

export default async function OrderConfirmationPage({ params }) {
  const { id } = await params
  const order = await getOrder(id)
  return <OrderConfirmationClient order={order} />
}
