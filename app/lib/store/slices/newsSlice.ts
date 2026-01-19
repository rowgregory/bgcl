import { INews } from '@/types/entities/news'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface NewsStatePayload {
  // Core data
  allNews: INews[]
  news: INews | null

  // UI state
  loading: boolean
  hasNews: boolean
  newsDrawer: boolean

  selectedNewsId: string | null

  // Error handling
  error: string | null
}

const initialNewsState: NewsStatePayload = {
  // Core data
  allNews: [],
  news: null,

  // UI state
  loading: false,
  hasNews: false,
  newsDrawer: false,

  selectedNewsId: null,

  // Error handling
  error: null
}

export const newsSlice = createSlice({
  name: 'news',
  initialState: initialNewsState,
  reducers: {
    hydrateAllNews: (state, { payload }) => {
      state.allNews = payload
    },
    hydrateNews: (state, { payload }) => {
      state.news = payload
    },
    resetNews: (state) => {
      state.error = null
      state.news = null
    },
    setOpenNewsDrawer: (state) => {
      state.newsDrawer = true
    },
    setCloseNewsDrawer: (state) => {
      state.newsDrawer = false
    },
    setSelectedNews: (state, { payload }) => {
      state.selectedNewsId = payload
    }
  }
})

export const newsReducer = newsSlice.reducer as Reducer<NewsStatePayload>

export const { hydrateAllNews, hydrateNews, resetNews, setCloseNewsDrawer, setOpenNewsDrawer, setSelectedNews } =
  newsSlice.actions
