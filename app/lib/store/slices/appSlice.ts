import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface AppStatePayload {
  mobileNavigation: boolean
  navigationDrawer: boolean
  heroStudio: boolean
  languageDropdown: boolean
  selectedLanguage: string
}

const initialAppState: AppStatePayload = {
  mobileNavigation: false,
  navigationDrawer: false,
  heroStudio: false,
  languageDropdown: false,
  selectedLanguage: 'English'
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
  setSelectedLanguage
} = appSlice.actions
