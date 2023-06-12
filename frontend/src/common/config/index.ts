import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

export const BASE_URL = process.env.BASE_URL || "";

export const BASE_QUERY = fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" })