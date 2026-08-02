'use client'

import { UpdateAddressModal } from '@/components/modals/UpdateAddressModal'
import CancelSubscriptionDrawer from '@/app/(authenticated)/supporter/_components/CancelSubscriptionDrawer'
import { PaymentMethodModal } from '@/components/modals/PaymentMethodModal'
import { SupporterHeader } from '@/app/(authenticated)/supporter/_components/SupporterHeader'

export default function SupporterPage({ children }) {
  return (
    <>
      <PaymentMethodModal />
      <CancelSubscriptionDrawer />
      <UpdateAddressModal />
      <SupporterHeader />
      {children}
    </>
  )
}
