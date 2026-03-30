'use client'

import { UpdateAddressModal } from '@/app/components/modals/UpdateAddressModal'
import CancelSubscriptionDrawer from '../../components/drawers/CancelSubscriptionDrawer'
import { PaymentMethodModal } from '../../components/modals/PaymentMethodModal'
import { SupporterHeader } from '@/app/components/supporter/SupporterHeader'

export default function SupporterPage({ children, result }) {
  return (
    <>
      <PaymentMethodModal />
      <CancelSubscriptionDrawer />
      <UpdateAddressModal />
      <SupporterHeader event={result.data} />
      {children}
    </>
  )
}
