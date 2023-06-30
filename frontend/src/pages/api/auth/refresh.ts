import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
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
    const server_url = process.env.NEXT_PRIVATE_BASE_URL;
    const response = await axios.put(`${server_url}/api/auth/key-auth`, body, {
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
