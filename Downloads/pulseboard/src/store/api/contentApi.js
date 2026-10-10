import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contentApi = createApi({
  reducerPath: "contentApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),

  endpoints: (builder) => ({
    getNews: builder.query({
      query: ({ category = "technology", q = "" } = {}) => {
        const params = new URLSearchParams();
        params.set("category", category);

        if (q.trim()) {
          params.set("q", q.trim());
        }

        return `news?${params.toString()}`;
      },
    }),

    getMovies: builder.query({
      query: ({ q = "", page = 1 } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));

        if (q.trim()) {
          params.set("q", q.trim());
        }

        return `movies?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetMoviesQuery,
} = contentApi;