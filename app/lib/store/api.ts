'use client'

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: `/api`,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
  // This ensures that cookies are included in
  // both the frontend and backend communication.
  credentials: 'include'
  // cache: "no-store",
})

export const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 })

export const api = createApi({
  reducerPath: 'splitApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: [],
  endpoints: () => ({})
})
