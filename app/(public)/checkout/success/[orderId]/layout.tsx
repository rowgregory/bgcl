import { getOrder } from '@/app/lib/actions/getOrder'
import CheckoutSuccessPage from './page'

export default async function CheckoutSuccessLayout() {
  const order = await getOrder('test-order-123')
  return <CheckoutSuccessPage order={order} />
}
