import { getPublicLayoutData } from '@/lib/actions/_infra/getPublicLayoutData'
import { ReactNode } from 'react'
import PublicChrome from './_components/PublicChrome'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { programs, donationOrders, capitalPage, hero } = await getPublicLayoutData()

  return (
    <PublicChrome programs={programs} capitalPage={capitalPage} donations={donationOrders.data} hero={hero?.data}>
      {children}
    </PublicChrome>
  )
}
