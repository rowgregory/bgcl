'use client'

import { UpdateAddressModal } from '@/app/components/modals/UpdateAddressModal'
import CancelSubscriptionDrawer from '../../components/drawers/CancelSubscriptionDrawer'
import { PaymentMethodModal } from '../../components/modals/PaymentMethodModal'
import { SupporterHeader } from '@/app/components/supporter/SupporterHeader'

export default function SupporterLayout({ children }) {
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
