import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { setCookie, getCookie } from "cookies-next";
import { api_url } from "@/common/utils/auth";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "PUT") {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }

  const refresh_token = getCookie("refresh_token", { req, res });

  const body = JSON.stringify({
    refresh_token,
  });

  try {
    const response = await axios.put(`${api_url}/api/auth/key-auth`, body, {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status !== 200)
      return res
        .status(response.status)
        .json({ result: "Failed to get access token." });

    return res.status(200).json({ result: response?.data });
  } catch (error: unknown) {
    console.log(error);
    return res.status(500).json({ result: "Internal server error" });
  }
}
