'use client'

import { Elements } from '@stripe/react-stripe-js'
import PaymentMethodDrawer from '../components/drawers/PaymentMethodDrawer'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function SupporterLayout({ children }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodDrawer />
      {children}
    </Elements>
  )
}
