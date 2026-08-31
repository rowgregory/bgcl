'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckoutStepIndicator } from '@/components/public/checkout/CheckoutStepIndicator'
import { TicketCheckoutHeader } from './TicketCheckoutHeader'
import { TicketCheckoutFooter } from './TicketCheckoutFooter'
import { TicketCheckoutOrderSummary } from './TicketCheckoutOrderSummary'
import type { CartItem } from '@/stores/useCartStore'

const STEP_LABELS = ['Sign in', 'Your info', 'Payment']

type Props = {
  step: number
  items: CartItem[]
  coverFees: boolean
  children: ReactNode
}

export function TicketCheckoutShell({ step, items, coverFees, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <TicketCheckoutHeader />

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <TicketCheckoutOrderSummary items={items} coverFees={coverFees} />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <CheckoutStepIndicator current={step} labels={STEP_LABELS} />
            {children}
          </motion.div>
        </div>
      </div>

      <TicketCheckoutFooter />
    </div>
  )
}
