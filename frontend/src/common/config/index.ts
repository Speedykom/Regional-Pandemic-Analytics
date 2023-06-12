import getConfig from "next/config";
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

const { publicRuntimeConfig } = getConfig();

export const BASE_URL = publicRuntimeConfig.BASE_URL || "";

export const BASE_QUERY = fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" })