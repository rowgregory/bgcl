import { getOrder } from '@/app/lib/actions/getOrder'
import OrderConfirmationPage from './page'

export default async function OrderConfirmationLayout({ params }) {
  const { id } = await params
  const order = await getOrder(id)
  return <OrderConfirmationPage order={order} />
}
