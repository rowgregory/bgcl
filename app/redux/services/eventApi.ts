import { api } from './api'

const BASE_URL = '/event'

export const eventApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createEvent: build.mutation({
      query: ({ ...event }) => ({
        url: BASE_URL,
        method: 'POST',
        body: event
      }),
      invalidatesTags: ['Event']
    }),
    createEventTicket: build.mutation({
      query: ({ id, ...eventTicket }) => ({
        url: `${BASE_URL}/${id}/ticket`,
        method: 'POST',
        body: eventTicket
      }),
      invalidatesTags: ['Event']
    }),
    deleteEvent: build.mutation({
      query: ({ eventId }) => ({
        url: `${BASE_URL}/${eventId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Event']
    }),
    getEvents: build.query({
      query: () => BASE_URL,
      providesTags: ['Event']
    }),
    updateEventTicket: build.mutation({
      query: ({ id, ...eventTicket }) => ({
        url: `${BASE_URL}/${id}/ticket`,
        method: 'PUT',
        body: eventTicket
      }),
      invalidatesTags: ['Event']
    }),
    updateEvent: build.mutation({
      query: ({ eventId, ...updateData }) => ({
        url: `${BASE_URL}/${eventId}`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: ['Event']
    }),
    updateEventStatus: build.mutation({
      query: ({ eventId, status }) => ({
        url: `${BASE_URL}/${eventId}/activate`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: ['Event']
    })
  })
})

export const {
  useCreateEventMutation,
  useCreateEventTicketMutation,
  useDeleteEventMutation,
  useGetEventsQuery,
  useUpdateEventMutation,
  useUpdateEventStatusMutation,
  useUpdateEventTicketMutation
} = eventApi
