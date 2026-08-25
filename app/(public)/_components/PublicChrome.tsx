'use client'

import { usePathname } from 'next/navigation'
import { TicketSelectionDrawer } from '../events/[eventId]/_components/casino/TicketSelectionDrawer'
import Header from '@/components/layout/header/Header'
import { Footer } from '@/components/layout/footer/Footer'
import DonationNotification from '@/components/layout/DonationNotification'
import VolunteerDrawer from '@/components/drawers/VolunteerDrawer'
import CapitalCampaignTab from '@/components/layout/CapitalCampaignTab'
import MobileNavigationDrawer from '@/components/layout/MobileNavigationDrawer'
import WelcomeAnimation from '@/components/layout/WelcomeAnimation'
import Confetti3D from '@/components/layout/Confetti3D'
import { AnnouncementStrip } from '@/components/layout/AnnouncementStrip'
import { HIDDEN_PATHS } from '@/lib/constants/navigation.constants'
import { Page, Program } from '@prisma/client'
import { IHero } from '@/types/entities/hero'

interface Props {
  children: React.ReactNode
  programs: Program[]
  capitalPage: Page | null
  donations: { id: string; customerName: string; createdAt: string }[]
  hero: IHero | null
}

export default function PublicChrome({ children, programs, capitalPage, donations, hero }: Props) {
  const pathname = usePathname()
  const showChrome = !HIDDEN_PATHS.some((path) => pathname.startsWith(path))

  return (
    <>
      <TicketSelectionDrawer />
      <Confetti3D />

      {showChrome && (
        <>
          <DonationNotification donations={donations} />
          <CapitalCampaignTab pageData={capitalPage} />

          <VolunteerDrawer programs={programs} />
          <MobileNavigationDrawer />

          <WelcomeAnimation />
          <AnnouncementStrip hero={hero} />

          <Header />
        </>
      )}

      {children}

      {showChrome && <Footer />}
    </>
  )
}
