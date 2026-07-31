'use client'

import { Provider } from 'react-redux'
import { persistor, store } from '@/lib/store/store'
import Toast from '@/components/_shared/Toast'
import { TicketSelectionDrawer } from './(public)/events/[eventId]/_components/casino/TicketSelectionDrawer'
import { PersistGate } from 'redux-persist/integration/react'
import Header from '@/components/header/Header'
import { usePathname } from 'next/navigation'
import { HIDDEN_PATHS } from '@/lib/constants/navigation.constants'
import { Footer } from '@/components/footer/Footer'
import DonationNotification from '@/components/layout/DonationNotification'
import VolunteerDrawer from '@/components/drawers/VolunteerDrawer'
import CapitalCampaignTab from '@/components/layout/CapitalCampaignTab'
import RegistrationModal from '@/components/modals/RegistrationModal'
import MobileNavigationDrawer from '@/components/layout/MobileNavigationDrawer'
import { ThemeProvider } from '@/lib/providers/theme.provider'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import WelcomeAnimation from '@/components/layout/WelcomeAnimation'
import { Confetti3D } from '@/components/layout/Confetti3D'
import { AnnouncementStrip } from '@/components/layout/AnnouncementStrip'
import { JobApplicationDrawer } from '@/components/drawers/JobApplicationDrawer'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function RootLayoutWrapper({ children, programs, pageContent, capitalPage, donations, hero }) {
  const pathname = usePathname()
  const show = !HIDDEN_PATHS.some((path) => pathname.startsWith(path))

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Elements stripe={stripePromise}>
          <ThemeProvider>
            <Toast />
            <TicketSelectionDrawer />
            <DonationNotification donations={donations} />
            <VolunteerDrawer programs={programs} />
            <CapitalCampaignTab pageData={capitalPage} />
            <RegistrationModal modal={pageContent?.sections?.modal} />
            <MobileNavigationDrawer />
            <JobApplicationDrawer />
            <WelcomeAnimation />
            <Confetti3D />
            <AnnouncementStrip hero={hero} />
            {show && <Header />}

            {children}
            {show && <Footer />}
          </ThemeProvider>
        </Elements>
      </PersistGate>
    </Provider>
  )
}
