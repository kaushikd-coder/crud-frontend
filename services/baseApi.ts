import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://crud-backend-15ir.onrender.com /api",
        credentials: "include",
    }),
    tagTypes: ["Entity", "User"],
    endpoints: () => ({}),
});
