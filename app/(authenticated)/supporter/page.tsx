'use client'

import { UpdateAddressModal } from '@/app/(authenticated)/supporter/_components/UpdateAddressModal'
import CancelSubscriptionDrawer from '@/app/(authenticated)/supporter/_components/CancelSubscriptionDrawer'
import PaymentMethodModal from '@/app/(authenticated)/supporter/_components/PaymentMethodModal'
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
