'use client'

import { stripePromise } from '@/lib/stripe/stripePromise'
import { Elements } from '@stripe/react-stripe-js'
import { ReactNode } from 'react'
import SupporterShell from './_components/SupporterShell'

export default function SupporterLayout({ children }: { children: ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      <SupporterShell>{children}</SupporterShell>
    </Elements>
  )
}
