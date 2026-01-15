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

export default function RootLayoutWrapper({ children }) {
  const pathname = usePathname()

  const show = !HIDDEN_PATHS.some((path) => pathname.startsWith(path))
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toast />
        <TicketSelectionDrawer />
        <LanguageDropdown />
        {show && <Header />}
        {children}
        {show && <Footer />}
      </PersistGate>
    </Provider>
  )
}
