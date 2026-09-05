'use client'

import { motion } from 'framer-motion'
import { CheckoutStepIndicator } from '@/components/public/checkout/CheckoutStepIndicator'
import { TicketCheckoutHeader } from './TicketCheckoutHeader'
import { TicketCheckoutFooter } from './TicketCheckoutFooter'
import { TicketCheckoutOrderSummary } from './TicketCheckoutOrderSummary'
import { ReactNode } from 'react'

export function TicketCheckoutShell({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <TicketCheckoutHeader />

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <TicketCheckoutOrderSummary />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <CheckoutStepIndicator current={step} />
            {children}
          </motion.div>
        </div>
      </div>

      <TicketCheckoutFooter />
    </div>
  )
}
