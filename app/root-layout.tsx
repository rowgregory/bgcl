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

export default function RootLayoutWrapper({ children, programs }) {
  const pathname = usePathname()

  const show = !HIDDEN_PATHS.some((path) => pathname.startsWith(path))

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toast />
        <TicketSelectionDrawer />
        <LanguageDropdown />
        <DonationNotification />
        <CapitalCampaignDrawer />
        <VolunteerDrawer programs={programs} />
        <FloatingDonateButton />
        <CapitalCampaignTab />
        <RegistrationModal />
        {show && <Header />}
        {children}
        {show && <Footer />}
      </PersistGate>
    </Provider>
  )
}
