'use client'

import CancelSubscriptionDrawer from '../components/drawers/CancelSubscriptionDrawer'
import PaymentMethodDrawer from '../components/drawers/PaymentMethodDrawer'

export default function SupporterLayout({ children }) {
  return (
    <>
      <PaymentMethodDrawer />
      <CancelSubscriptionDrawer />
      {children}
    </>
  )
}
