import { api } from './api'

const BASE_URL = '/dashboard'

export const dashboardApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    listAdminStats: build.query({
      query: ({ chapterId }) => `${BASE_URL}/${chapterId}/admin/list-stats`,
      providesTags: ['Dashboard']
    }),
    listMemberStats: build.query({
      query: ({ chapterId }) => `${BASE_URL}/${chapterId}/member/list-stats`,
      providesTags: ['Dashboard']
    })
  })
})

export const { useListAdminStatsQuery, useListMemberStatsQuery } = dashboardApi
