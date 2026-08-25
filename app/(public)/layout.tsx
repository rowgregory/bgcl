import { getHomePageData } from '@/lib/actions/_infra/getHomePageData'
import { ReactNode } from 'react'
import PublicChrome from './_components/PublicChrome'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { programs, donationOrders, homePage, capitalPage, hero } = await getHomePageData()

  return (
    <PublicChrome
      programs={programs}
      pageContent={homePage}
      capitalPage={capitalPage}
      donations={donationOrders.data}
      hero={hero?.data}
    >
      {children}
    </PublicChrome>
  )
}
