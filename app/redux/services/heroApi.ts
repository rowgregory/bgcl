import { api } from "./api";

const BASE_URL = "/hero";

export const heroApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getHeroes: build.query({
      query: () => BASE_URL,
      providesTags: ["Hero"],
    }),
    createHero: build.mutation({
      query: ({ ...hero }) => ({
        url: BASE_URL,
        method: "POST",
        body: hero,
      }),
      invalidatesTags: ["Hero"],
    }),
    updateHero: build.mutation({
      query: ({ heroId, ...updateData }) => ({
        url: `${BASE_URL}/${heroId}`,
        method: "PATCH",
        body: { heroId, ...updateData },
      }),
      invalidatesTags: ["Hero"],
    }),

    updateHeroStatus: build.mutation({
      query: ({ heroId, status }) => ({
        url: `${BASE_URL}/${heroId}/activate`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Hero"],
    }),
    deleteHero: build.mutation({
      query: ({ heroId }) => ({
        url: `${BASE_URL}/${heroId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hero"],
    }),
  }),
});

export const {
  useGetHeroesQuery,
  useCreateHeroMutation,
  useUpdateHeroMutation,
  useUpdateHeroStatusMutation,
  useDeleteHeroMutation,
} = heroApi;
