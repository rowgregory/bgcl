import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import { useCartSelector } from '../store/store'
import { usePaymentProcessor } from './usePaymentProcessor'
import { setTicketCheckoutForm as setForm } from '../utils/setTicketCheckoutForm'
import { createPaymentIntentForTicketCheckout } from '../actions/createPaymentIntentForTicketCheckout'

export function useTicketCheckoutSubmit({ inputs, amountInCents, processingFee, usingSavedCard, fullName }) {
  const stripe = useStripe()
  const elements = useElements()
  const session = useSession()
  const userEmail = session.data?.user?.email
  const { items } = useCartSelector()
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  const pusherCallbacks = [
    (value: string) => setForm({ error: value }),
    (value: string) => setForm({ processingStatus: value }),
    () => setForm({ loading: false })
  ] as const

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!stripe || !elements) return setForm({ error: 'Stripe not loaded' })

    setForm({ loading: true, error: null, processingStatus: 'processing' })

    try {
      const ticketData = items.map((item) => ({
        ticketId: item.ticketId,
        quantity: item.quantity,
        pricePerUnit: item.price,
        ticketName: item.ticketName,
        ticketDescription: item.ticketDescription ?? null,
        ticketType: item.ticketType ?? 'GENERAL',
        isRaffleTicket: item.isRaffleTicket ?? false,
        guestCount: item.guestCount ?? 1
      }))

      const intentResult = await createPaymentIntentForTicketCheckout({
        userId: session?.data?.user?.id,
        name: fullName,
        email: userEmail,
        amount: amountInCents,
        description: `Order for ${fullName}`,
        saveCard: inputs?.saveCard,
        coverFees: inputs?.coverFees,
        feesCovered: inputs?.coverFees ? processingFee : 0,
        address: {
          addressLine1: inputs?.addressLine1,
          addressLine2: inputs?.addressLine2,
          city: inputs?.city,
          state: inputs?.state,
          zipCode: inputs?.zipPostalCode,
          country: inputs?.country
        },
        savedCardId: usingSavedCard ? inputs?.selectedCardId : undefined,
        tickets: JSON.stringify(ticketData.map(({ ticketDescription: _, ...rest }) => rest)),
        eventId: items[0]?.eventId,
        attendingEvent: inputs.attendingEvent
      })

      if (!intentResult.success) throw new Error(intentResult.error || 'Failed to create payment intent')

      if (usingSavedCard) {
        setupPusherListenerOneTime(
          intentResult.paymentIntentId!,
          false,
          inputs?.selectedCardId,
          inputs?.processingStatus,
          ...pusherCallbacks
        )
        return
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error, paymentIntent } = await stripe.confirmCardPayment(intentResult.clientSecret!, {
        payment_method: { card: cardElement, billing_details: { name: fullName, email: userEmail } }
      })

      if (error) {
        setForm({ processingStatus: 'failed', error: error.message || 'Payment failed' })
      } else if (paymentIntent?.status === 'succeeded') {
        setupPusherListenerOneTime(
          paymentIntent.id,
          inputs?.saveCard,
          getPaymentMethodId(paymentIntent.payment_method),
          inputs?.processingStatus,
          ...pusherCallbacks
        )
      }
    } catch (err) {
      setForm({
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        processingStatus: 'failed'
      })
    }
  }

  return { handleSubmit }
}
