'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckoutStepIndicator } from '@/components/public/checkout/CheckoutStepIndicator'
import { DonateFormHeader } from './DonateFormHeader'
import { DonateFormLeftColumn } from './DonateFormLeftColumn'

export function DonateShell({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <DonateFormHeader />

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <DonateFormLeftColumn />

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
    </div>
  )
}
