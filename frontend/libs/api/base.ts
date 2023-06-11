import { JWT } from "next-auth/jwt";
import process from "process";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestData {
  url: string;
  body?: any;
  headers?: HeadersInit;
}

const sendRequest = (
  url: string,
  method: HTTPMethod,
  body: any,
  headers?: HeadersInit
): Promise<Response> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${url}`, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers,
  } as RequestInit);

export const get = (data: RequestData): Promise<Response> =>
  sendRequest(data.url, "GET", null, data.headers);

export const post = (data: RequestData): Promise<Response> =>
  sendRequest(data.url, "POST", data.body, data.headers);

export const put = (data: RequestData): Promise<Response> =>
  sendRequest(data.url, "PUT", data.body, data.headers);

export const patch = (data: RequestData): Promise<Response> =>
  sendRequest(data.url, "PUT", data.body, data.headers);

export const deleteReq = (data: RequestData): Promise<Response> =>
  sendRequest(data.url, "DELETE", null, data.headers);

type RequestHandler = (data: RequestData) => Promise<Response>;

export const authorizedRequest = (
  token: string | undefined,
  reqData: RequestData,
  handler: RequestHandler
): Promise<Response> => {
  if (reqData.headers) {
    (reqData.headers as Record<string, string>)["Authorization"] = token ?? "";
  } else {
    reqData.headers = {
      Authorization: token,
    } as Record<string, string>;
  }

  return handler(reqData);
};
