import { getPublicLayoutData } from '@/lib/actions/_infra/getPublicLayoutData'
import { ReactNode } from 'react'
import PublicChrome from './_components/PublicChrome'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { donationOrders, capitalPage, hero } = await getPublicLayoutData()

  return (
    <PublicChrome capitalPage={capitalPage} donations={donationOrders.data} hero={hero?.data}>
      {children}
    </PublicChrome>
  )
}
