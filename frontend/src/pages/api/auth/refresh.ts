import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import getConfig from "next/config"
 
const { publicRuntimeConfig } = getConfig()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "PUT") {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }

  const tokens: any = secureLocalStorage.getItem("tokens");

  const body = JSON.stringify({
    refresh_token: tokens?.refreshToken,
  });

  try {
    const response = await axios.put(`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/auth/key-auth`, body, {
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
