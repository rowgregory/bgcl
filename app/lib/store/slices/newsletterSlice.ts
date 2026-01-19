import { INewsletter } from '@/types/entities/newsletter'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface NewsletterStatePayload {
  // Core data
  newsletters: INewsletter[]
  newsletter: INewsletter | null

  // UI state
  loading: boolean
  hasNewsletter: boolean
  newsletterDrawer: boolean

  selectedNewsletterId: string | null

  // Error handling
  error: string | null
}

const initialNewsletterState: NewsletterStatePayload = {
  // Core data
  newsletters: [],
  newsletter: null,

  // UI state
  loading: false,
  hasNewsletter: false,
  newsletterDrawer: false,

  selectedNewsletterId: null,

  // Error handling
  error: null
}

export const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState: initialNewsletterState,
  reducers: {
    hydrateNewsletters: (state, { payload }) => {
      state.newsletters = payload
    },
    hydrateNewsletter: (state, { payload }) => {
      state.newsletter = payload
    },
    resetNewsletter: (state) => {
      state.error = null
      state.newsletter = null
    },
    setOpenNewsletterDrawer: (state) => {
      state.newsletterDrawer = true
    },
    setCloseNewsletterDrawer: (state) => {
      state.newsletterDrawer = false
    },
    setSelectedNewsletter: (state, { payload }) => {
      state.selectedNewsletterId = payload
    }
  }
})

export const newsletterReducer = newsletterSlice.reducer as Reducer<NewsletterStatePayload>

export const {
  hydrateNewsletters,
  hydrateNewsletter,
  resetNewsletter,
  setCloseNewsletterDrawer,
  setOpenNewsletterDrawer,
  setSelectedNewsletter
} = newsletterSlice.actions
