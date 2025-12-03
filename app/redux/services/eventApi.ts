import { api } from './api'

const BASE_URL = '/event'

export const eventApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getEvents: build.query({
      query: () => BASE_URL,
      providesTags: ['Event']
    }),
    createEvent: build.mutation({
      query: ({ ...event }) => ({
        url: BASE_URL,
        method: 'POST',
        body: event
      }),
      invalidatesTags: ['Event']
    }),
    updateEvent: build.mutation({
      query: ({ eventId, ...updateData }) => ({
        url: `${BASE_URL}/${eventId}`,
        method: 'PATCH',
        body: { ...updateData }
      }),
      invalidatesTags: ['Event']
    }),

    updateEventStatus: build.mutation({
      query: ({ eventId, status }) => ({
        url: `${BASE_URL}/${eventId}/activate`,
        method: 'POST',
        body: { status }
      }),
      invalidatesTags: ['Event']
    }),
    deleteEvent: build.mutation({
      query: ({ eventId }) => ({
        url: `${BASE_URL}/${eventId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Event']
    })
  })
})

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useUpdateEventStatusMutation,
  useDeleteEventMutation
} = eventApi
