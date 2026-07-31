import { getOrder } from '@/lib/actions/order/getOrder'
import CheckoutSuccessPage from './page'

export default async function CheckoutSuccessLayout() {
  const order = await getOrder('test-order-123')
  return <CheckoutSuccessPage order={order} />
}
