import secureLocalStorage from "react-secure-storage";

export const prepareHeaders = (headers: any, { getState, endpoint }: any) => {
    const tokens = secureLocalStorage.getItem("tokens");

    if (!tokens) headers;

    const { accessToken } = (tokens as any);

    headers.set("AUTHORIZATION", `Bearer ${accessToken}`);

    return headers;
}