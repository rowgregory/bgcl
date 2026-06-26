import OrderConfirmationClient from '@/app/components/pages/OrderConfirmationClient'
import { getOrder } from '@/app/lib/actions/order/getOrder'

export default async function OrderConfirmationPage({ params }) {
  const { id } = await params
  const order = await getOrder(id)
  return <OrderConfirmationClient order={order} />
}
