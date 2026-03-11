'use client'

import { combineReducers, Reducer } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { api } from './api'
import { formReducer } from './slices/formSlice'
import { logReducer } from './slices/logSlice'
import { adminReducer } from './slices/adminSlice'
import { userReducer } from './slices/userSlice'
import { toastReduer } from './slices/toastSlice'
import { settingsReducer } from './slices/settingsSlice'
import { appReducer } from './slices/appSlice'
import { dashboardReducer } from './slices/dashboardSlice'
import { eventReducer } from './slices/eventSlice'
import { statsReducer } from './slices/statsSlice'
import { programReducer } from './slices/programSlice'
import { ticketReducer } from './slices/ticketSlice'
import { persistStore, persistReducer } from 'redux-persist'
import { cartReducer } from './slices/cartSlice'
import { PersistPartial } from 'redux-persist/es/persistReducer'
import { teamMemberReducer } from './slices/teamMemberSlice'
import { newsReducer } from './slices/newsSlice'
import { newsletterReducer } from './slices/newsletterSlice'
import { clubResourceReducer } from './slices/clubResourceSlice'
import { campaignReducer } from './slices/campaignSlice'
import { closingReducer } from './slices/closingSlice'
import { uiReducer } from './slices/uiSlice'

// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    }
  }
}

// Create localStorage storage
const createLocalStorage = () => {
  return {
    getItem: (key: string) => {
      if (typeof window === 'undefined') return Promise.resolve(null)
      return Promise.resolve(localStorage.getItem(key))
    },
    setItem: (key: string, value: string) => {
      if (typeof window === 'undefined') return Promise.resolve()
      localStorage.setItem(key, value)
      return Promise.resolve()
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') return Promise.resolve()
      localStorage.removeItem(key)
      return Promise.resolve()
    }
  }
}

// Use localStorage on client, noop on server
const storage = typeof window !== 'undefined' ? createLocalStorage() : createNoopStorage()

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart']
}

const rootReducer = combineReducers({
  form: formReducer,
  user: userReducer,
  log: logReducer,
  admin: adminReducer,
  toast: toastReduer,
  settings: settingsReducer,
  app: appReducer,
  dashboard: dashboardReducer,
  event: eventReducer,
  stats: statsReducer,
  program: programReducer,
  ticket: ticketReducer,
  cart: cartReducer,
  teamMember: teamMemberReducer,
  news: newsReducer,
  newsletter: newsletterReducer,
  clubResource: clubResourceReducer,
  campaign: campaignReducer,
  closing: closingReducer,
  ui: uiReducer,
  [api.reducerPath]: api.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

type PersistedReducer = Reducer<ReturnType<typeof rootReducer> & PersistPartial>

export const store = configureStore({
  reducer: persistedReducer as PersistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    }).concat(api.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppSelector = typeof store.getState

export const useAppDispatch: () => AppDispatch = useDispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useUserSelector = () => useAppSelector((state) => state.user)
export const useAdminSelector = () => useAppSelector((state) => state.admin)
export const useToastSelector = () => useAppSelector((state) => state.toast)
export const useSettingsSelector = () => useAppSelector((state) => state.settings)
export const useFormSelector = () => useAppSelector((state) => state.form)
export const useDashboardSelector = () => useAppSelector((state) => state.dashboard)
export const useEventSelector = () => useAppSelector((state) => state.event)
export const useApplicationSelector = () => useAppSelector((state) => state.app)
export const useStatsSelector = () => useAppSelector((state) => state.stats)
export const useProgramSelector = () => useAppSelector((state) => state.program)
export const useTicketSelector = () => useAppSelector((state) => state.ticket)
export const useCartSelector = () => useAppSelector((state) => state.cart)
export const useTeamMemberSelector = () => useAppSelector((state) => state.teamMember)
export const useNewsSelector = () => useAppSelector((state) => state.news)
export const useNewsletterSelector = () => useAppSelector((state) => state.newsletter)
export const useClubResourceSelector = () => useAppSelector((state) => state.clubResource)
export const useCampaignSelector = () => useAppSelector((state) => state.campaign)
export const useClosingSelector = () => useAppSelector((state) => state.closing)
export const useUiSelector = () => useAppSelector((state) => state.ui)
