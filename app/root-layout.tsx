'use client'

import { Provider } from 'react-redux'
import { persistor, store } from './lib/store/store'
import Toast from './components/common/Toast'
import { TicketSelectionDrawer } from './components/drawers/TicketSelectionDrawer'
import { PersistGate } from 'redux-persist/integration/react'
import Header from './components/header/Header'
import { usePathname } from 'next/navigation'
import { HIDDEN_PATHS } from './lib/constants/navigation'
import { Footer } from './components/footer/Footer'
import DonationNotification from './components/DonationNotification'
import VolunteerDrawer from './components/drawers/VolunteerDrawer'
import CapitalCampaignTab from './components/CapitalCampaignTab'
import RegistrationModal from './components/modals/RegistrationModal'
import MobileNavigationDrawer from './components/MobileNavigationDrawer'
import { ThemeProvider } from './lib/providers/theme'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import WelcomeAnimation from './components/WelcomeAnimation'
import { Confetti3D } from './components/unique/Confetti3D'
import { AnnouncementStrip } from './components/unique/AnnouncementStrip'
import { JobApplicationDrawer } from './components/drawers/JobApplicationDrawer'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function RootLayoutWrapper({ children, programs, pageContent, donations, hero }) {
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
            <CapitalCampaignTab />
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
