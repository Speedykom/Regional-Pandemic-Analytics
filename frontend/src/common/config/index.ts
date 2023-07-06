import secureLocalStorage from "react-secure-storage";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const SUPERSET_URL = process.env.NEXT_PUBLIC_SUPERSET_URL

export const prepareHeaders = (headers: any, { getState, endpoint }: any) => {
    const tokens = secureLocalStorage.getItem("tokens");

    if (!tokens) headers;

    const { accessToken } = (tokens as any);

    headers.set("AUTHORIZATION", `Bearer ${accessToken}`);

    return headers;
  }