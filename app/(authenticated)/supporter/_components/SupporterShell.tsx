'use client'

import { UpdateAddressModal } from '@/app/(authenticated)/supporter/_components/UpdateAddressModal'
import CancelSubscriptionDrawer from '@/app/(authenticated)/supporter/_components/CancelSubscriptionDrawer'
import { SupporterHeader } from '@/app/(authenticated)/supporter/_components/SupporterHeader'
import { ReactNode } from 'react'

export default function SupporterShell({ children }: { children: ReactNode }) {
  return (
    <>
      <CancelSubscriptionDrawer />
      <UpdateAddressModal />
      <SupporterHeader />
      {children}
    </>
  )
}
