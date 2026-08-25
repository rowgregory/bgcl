'use client'

import { DonationDrawer } from './_components/DonationDrawer'
import { FailedPaymentsDrawer } from '@/components/drawers/FailedPaymentDrawer'

export default function DonationsLayout({ children }) {
  return (
    <>
      <DonationDrawer />
      <FailedPaymentsDrawer />

      {children}
    </>
  )
}
