import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import secureLocalStorage from "react-secure-storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).send(`Method ${req.method} not allowed`);
  const server_url = process.env.NEXT_PRIVATE_BASE_URL;

  const { refreshToken } = req.body;

  const response = await axios.get(`${server_url}/api/auth/logout`, {
    headers: { 'Authorization': `Bearer ${refreshToken}` }
  });

  if (response.status !== 200)
    return res.status(response.status).json({ result: response.data });

  return res.status(200).json(response.data);
}
