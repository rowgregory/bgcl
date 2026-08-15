'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Pusher, { type Channel } from 'pusher-js'
import type { PaymentMethod } from '@stripe/stripe-js'

import { savePaymentMethod } from '@/lib/actions/stripe/savePaymentMethod'
import { useConfettiStore } from '@/stores/useConfettiStore'

type OrderCreatedEvent = { orderId: string }
type OrderFailedEvent = { error?: string }

type SetError = (value: string) => void
type SetProcessingStatus = (value: string) => void
type SetLoading = (value?: boolean) => void

const PROCESSING_TIMEOUT_MS = 10_000
const TIMEOUT_MESSAGE = 'Order processing timeout. Please check your email for confirmation.'

export function usePaymentProcessor() {
  const router = useRouter()
  const session = useSession()

  const pusherRef = useRef<Pusher | null>(null)
  const channelRef = useRef<Channel | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // One terminal event per attempt, whichever lands first
  const settledRef = useRef(false)

  const getPaymentMethodId = (paymentMethod: string | PaymentMethod | null | undefined): string | undefined => {
    return typeof paymentMethod === 'string' ? paymentMethod : paymentMethod?.id
  }

  const teardown = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const channel = channelRef.current
    const pusher = pusherRef.current

    if (channel) {
      channel.unbind_all()
      pusher?.unsubscribe(channel.name)
    }

    pusher?.disconnect()

    channelRef.current = null
    pusherRef.current = null
  }, [])

  // Navigating away mid-payment shouldn't leave a socket open
  useEffect(() => teardown, [teardown])

  const subscribe = useCallback(
    (
      channelName: string,
      setError: SetError,
      setProcessingStatus: SetProcessingStatus,
      setLoading: SetLoading,
      onCreated?: () => void
    ) => {
      teardown()
      settledRef.current = false

      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
      })
      const channel = pusher.subscribe(channelName)

      pusherRef.current = pusher
      channelRef.current = channel

      timeoutRef.current = setTimeout(() => {
        if (settledRef.current) return
        settledRef.current = true

        setError(TIMEOUT_MESSAGE)
        setProcessingStatus('failed')
        setLoading(false)
        teardown()
      }, PROCESSING_TIMEOUT_MS)

      channel.bind('order-created', (data: OrderCreatedEvent) => {
        if (settledRef.current) return
        settledRef.current = true

        setProcessingStatus('success')
        onCreated?.()
        teardown()

        useConfettiStore.getState().burst()
        router.push(`/order-confirmation/${data.orderId}`)
      })

      channel.bind('order-failed', (data: OrderFailedEvent) => {
        if (settledRef.current) return
        settledRef.current = true

        setError(data.error || 'Order processing failed')
        setProcessingStatus('failed')
        setLoading(false)
        teardown()
      })
    },
    [router, teardown]
  )

  const setupPusherListenerOneTime = useCallback(
    (
      saveCard: boolean | undefined,
      paymentMethod: string | undefined,
      setError: SetError,
      setProcessingStatus: SetProcessingStatus,
      setLoading: SetLoading
    ) => {
      const userId = session?.data?.user?.id

      if (!userId) {
        setError('Your session expired. Please sign in and try again.')
        setProcessingStatus('failed')
        setLoading(false)
        return
      }

      subscribe(`payment-${userId}`, setError, setProcessingStatus, setLoading, () => {
        if (!saveCard || !paymentMethod) return

        void (async () => {
          const res = await savePaymentMethod({ stripePaymentId: paymentMethod, isDefault: true })

          if (!res.success) {
            console.error('Failed to save payment method:', res.error)
          }
        })()
      })
    },
    [session?.data?.user?.id, subscribe]
  )

  const setupPusherListenerRecurring = useCallback(
    (
      subscriptionResult: { subscriptionId?: string } | undefined,
      setError: SetError,
      setProcessingStatus: SetProcessingStatus,
      setLoading: SetLoading
    ) => {
      const subscriptionId = subscriptionResult?.subscriptionId

      if (!subscriptionId) {
        setError('Missing subscription. Please try again.')
        setProcessingStatus('failed')
        setLoading(false)
        return
      }

      subscribe(`payment-${subscriptionId}`, setError, setProcessingStatus, setLoading)
    },
    [subscribe]
  )

  return {
    getPaymentMethodId,
    setupPusherListenerOneTime,
    setupPusherListenerRecurring
  }
}
