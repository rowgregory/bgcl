'use client'

import PaymentMethodDrawer from '../components/drawers/PaymentMethodDrawer'

export default function SupporterLayout({ children }) {
  return (
    <>
      <PaymentMethodDrawer />
      {children}
    </>
  )
}
