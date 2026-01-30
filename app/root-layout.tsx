'use client'

import { Provider } from 'react-redux'
import { persistor, store } from './lib/store/store'
import Toast from './components/common/Toast'
import { TicketSelectionDrawer } from './components/drawers/TicketSelectionDrawer'
import { PersistGate } from 'redux-persist/integration/react'
import Header from './components/header/Header'
import { usePathname } from 'next/navigation'
import { HIDDEN_PATHS } from './lib/constants/navigation'
import { LanguageDropdown } from './components/dropdowns/LanguageDropdown'
import { Footer } from './components/footer/Footer'
import DonationNotification from './components/DonationNotification'
import CapitalCampaignDrawer from './components/drawers/CapitalCampaignDrawer'
import VolunteerDrawer from './components/drawers/VolunteerDrawer'
import FloatingDonateButton from './components/FloatingButton'
import CapitalCampaignTab from './components/CapitalCampaignTab'
import RegistrationModal from './components/modals/RegistrationModal'
import MobileNavigationDrawer from './components/MobileNavigationDrawer'
import { ThemeProvider } from './lib/providers/theme'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import TestingBanner from './components/TestingBanner'
import WelcomeAnimation from './components/WelcomeAnimation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function RootLayoutWrapper({ children, programs, pageContent, donations }) {
  const pathname = usePathname()
  const show = !HIDDEN_PATHS.some((path) => pathname.startsWith(path))

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Elements stripe={stripePromise}>
          <ThemeProvider>
            <Toast />
            <TicketSelectionDrawer />
            <LanguageDropdown />
            <DonationNotification donations={donations} />
            <CapitalCampaignDrawer />
            <VolunteerDrawer programs={programs} />
            <FloatingDonateButton />
            <CapitalCampaignTab />
            <RegistrationModal pageContent={pageContent?.content} />
            <MobileNavigationDrawer />
            <TestingBanner />
            <WelcomeAnimation />
            {show && <Header />}
            {children}
            {show && <Footer />}
          </ThemeProvider>
        </Elements>
      </PersistGate>
    </Provider>
  )
}
