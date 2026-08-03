'use client'

import { combineReducers, Reducer } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { formReducer } from './slices/formSlice'
import { toastReduer } from './slices/toastSlice'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistPartial } from 'redux-persist/es/persistReducer'
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
  toast: toastReduer,
  ui: uiReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

type PersistedReducer = Reducer<ReturnType<typeof rootReducer> & PersistPartial>

export const store = configureStore({
  reducer: persistedReducer as PersistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppSelector = typeof store.getState

export const useAppDispatch: () => AppDispatch = useDispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useToastSelector = () => useAppSelector((state) => state.toast)
export const useFormSelector = () => useAppSelector((state) => state.form)
export const useUiSelector = () => useAppSelector((state) => state.ui)
