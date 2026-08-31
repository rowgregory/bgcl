import { getOrder } from '@/lib/actions/order/getOrder'
import OrderNotFoundNotice from './_components/OrderNotFoundNotice'
import OrderConfirmationClient from './OrderConfirmationClient'
import Confetti3D from '@/components/layout/Confetti3D'

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getOrder(id)

  if (!result?.data) return <OrderNotFoundNotice orderId={id} />

  return (
    <>
      <OrderConfirmationClient order={result.data} />
      <Confetti3D />
    </>
  )
}
