import { useElements, useStripe } from '@stripe/react-stripe-js'
import { PaymentMethod } from '@stripe/stripe-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Pusher from 'pusher-js'
import { useDispatch } from 'react-redux'
import { savePaymentMethod } from '../actions/savePaymentMethod'

// hooks/useDonationPayment.ts
export function useDonationPayment() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const store = useDispatch()
  const session = useSession()

  const getPaymentMethodId = (paymentMethod: string | PaymentMethod | undefined): string | undefined => {
    return typeof paymentMethod === 'string' ? paymentMethod : paymentMethod?.id
  }

  const setupPusherListenerOneTime = (
    paymentIntentId: string,
    saveCard?: boolean,
    paymentMethod?: string,
    processingStatus?: string,
    setError?: any,
    setProcessingStatus?: any,
    setLoading?: any
  ) => {
    const channelId = session?.data?.user?.id || `guest-${paymentIntentId}`
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    })
    const channel = pusher.subscribe(`payment-${channelId}`)

    const timeout = setTimeout(() => {
      if (processingStatus === 'processing') {
        setError('Order processing timeout. Please check your email for confirmation.')
        setProcessingStatus('failed')
        setLoading(false)
      }
    }, 10000)

    channel.bind('order-created', (data: any) => {
      clearTimeout(timeout)
      setProcessingStatus('success')
      setLoading(false)

      if (saveCard && session?.data?.user?.id && paymentMethod) {
        savePaymentMethod(session.data.user.id, paymentMethod as string, true).catch(console.error)
      }

      setTimeout(() => router.push(`/order-confirmation/${data.orderId}`), 1000)
      channel.unbind('order-created')
    })

    channel.bind('order-failed', (data: any) => {
      clearTimeout(timeout)
      setProcessingStatus('failed')
      setError(data.error || 'Order processing failed')
      setLoading(false)
      channel.unbind('order-created')
      channel.unbind('order-failed')
    })
  }

  const setupPusherListenerRecurring = (
    subscriptionResult?: any,
    processingStatus?: string,
    setError?: any,
    setProcessingStatus?: any,
    setLoading?: any
  ) => {
    const channelId = session?.data?.user?.id || `guest-${subscriptionResult.subscriptionId}`

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    })

    const channel = pusher.subscribe(`payment-${channelId}`)

    const timeout = setTimeout(() => {
      if (processingStatus === 'processing') {
        setError('Order processing timeout. Please check your email for confirmation.')
        setProcessingStatus('failed')
        setLoading(false)
      }
    }, 10000)

    channel.bind('order-created', (data: any) => {
      clearTimeout(timeout)
      setProcessingStatus('success')
      setLoading(false)
      setTimeout(() => router.push(`/order-confirmation/${data.orderId}`), 1000)
      channel.unbind('order-created')
    })

    channel.bind('order-failed', (data: any) => {
      clearTimeout(timeout)
      setProcessingStatus('failed')
      setLoading(false)
      setError(data.error || 'Order processing failed')
      channel.unbind('order-created')
      channel.unbind('order-failed')
    })
  }

  const handleOneTimeDonation = async (params) => {
    // All your one-time donation logic (saved + new card)
    // Returns success/error
  }

  const handleRecurringDonation = async (params) => {
    // All your recurring donation logic
    // Returns success/error
  }

  return {
    handleOneTimeDonation,
    handleRecurringDonation,
    getPaymentMethodId,
    setupPusherListenerOneTime,
    setupPusherListenerRecurring
  }
}
