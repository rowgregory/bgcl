import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface AppStatePayload {
  mobileNavigation: boolean
  navigationDrawer: boolean
  heroStudio: boolean
  languageDropdown: boolean
  selectedLanguage: string
  capitalCampaignDrawer: boolean
  volunteerDrawer: boolean
}

const initialAppState: AppStatePayload = {
  mobileNavigation: false,
  navigationDrawer: false,
  heroStudio: false,
  languageDropdown: false,
  selectedLanguage: 'English',
  capitalCampaignDrawer: false,
  volunteerDrawer: false
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
  setOpenVolunteerDrawer
} = appSlice.actions
