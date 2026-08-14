import type { PaymentMethod } from '@stripe/stripe-js'

/** Stripe returns `payment_method` as either an id or an expanded object. */
export default function getPaymentMethodId(paymentMethod: string | PaymentMethod | null | undefined) {
  return typeof paymentMethod === 'string' ? paymentMethod : paymentMethod?.id
}
