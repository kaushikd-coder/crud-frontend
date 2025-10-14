import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
        credentials: "include",
    }),
    tagTypes: ["Entity", "User"],
    endpoints: () => ({}),
});
