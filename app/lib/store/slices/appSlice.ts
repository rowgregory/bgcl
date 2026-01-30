import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface AppStatePayload {
  mobileNavigation: boolean
  navigationDrawer: boolean
  heroStudio: boolean
  languageDropdown: boolean
  selectedLanguage: string
  capitalCampaignDrawer: boolean
  volunteerDrawer: boolean
  paymentMethodDrawer: boolean
  isDark: boolean
  cancelSubscriptionDrawer: boolean
  cancelSubscriptionDetails: any | null
  isSpanish: boolean
}

const initialAppState: AppStatePayload = {
  mobileNavigation: false,
  navigationDrawer: false,
  heroStudio: false,
  languageDropdown: false,
  selectedLanguage: 'English',
  capitalCampaignDrawer: false,
  volunteerDrawer: false,
  paymentMethodDrawer: false,
  isDark: false,
  cancelSubscriptionDrawer: false,
  cancelSubscriptionDetails: null,
  isSpanish: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setOpenMobileNavigation: (state) => {
      state.mobileNavigation = true
    },
    setCloseMobileNavigation: (state) => {
      state.mobileNavigation = false
    },
    setOpenNavigationDrawer: (state) => {
      state.navigationDrawer = true
    },
    setCloseNavigationDrawer: (state) => {
      state.navigationDrawer = false
    },
    setOpenHeroStudio: (state) => {
      state.heroStudio = true
    },
    setCloseHeroStudio: (state) => {
      state.heroStudio = false
    },
    setOpenLanguageDropdown: (state) => {
      state.languageDropdown = true
    },
    setCloseLanguageDropdown: (state) => {
      state.languageDropdown = false
    },
    setSelectedLanguage: (state, { payload }) => {
      state.selectedLanguage = payload
    },
    setOpenCapitalCampaignDrawer: (state) => {
      state.capitalCampaignDrawer = true
    },
    setCloseCapitalCampaignDrawer: (state) => {
      state.capitalCampaignDrawer = false
    },
    setOpenVolunteerDrawer: (state) => {
      state.volunteerDrawer = true
    },
    setCloseVolunteerDrawer: (state) => {
      state.volunteerDrawer = false
    },
    setOpenPaymentMethodDrawer: (state) => {
      state.paymentMethodDrawer = true
    },
    setClosePaymentMethodDrawer: (state) => {
      state.paymentMethodDrawer = false
    },
    setOpenCancelSubscriptionDrawer: (state, { payload }) => {
      state.cancelSubscriptionDrawer = true
      state.cancelSubscriptionDetails = payload
    },
    setCloseCancelSubscriptionDrawer: (state) => {
      state.cancelSubscriptionDrawer = false
    },
    setIsDark: (state, { payload }) => {
      state.isDark = payload
    },
    setIsSpanish: (state) => {
      state.isSpanish = true
    },
    setIsNotSpanish: (state) => {
      state.isSpanish = false
    }
  }
})

export const appReducer = appSlice.reducer as Reducer<AppStatePayload>

export const {
  setOpenMobileNavigation,
  setCloseMobileNavigation,
  setOpenNavigationDrawer,
  setCloseNavigationDrawer,
  setCloseHeroStudio,
  setOpenHeroStudio,
  setCloseLanguageDropdown,
  setOpenLanguageDropdown,
  setSelectedLanguage,
  setCloseCapitalCampaignDrawer,
  setOpenCapitalCampaignDrawer,
  setCloseVolunteerDrawer,
  setOpenVolunteerDrawer,
  setOpenPaymentMethodDrawer,
  setClosePaymentMethodDrawer,
  setIsDark,
  setCloseCancelSubscriptionDrawer,
  setOpenCancelSubscriptionDrawer,
  setIsNotSpanish,
  setIsSpanish
} = appSlice.actions
