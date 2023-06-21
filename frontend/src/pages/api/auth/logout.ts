import { BASE_URL } from "@/common/config";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import secureLocalStorage from "react-secure-storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).send(`Method ${req.method} not allowed`);

  const tokens: any = secureLocalStorage.getItem("tokens") as object

  return await axios.get(`${BASE_URL}/api/auth/logout`, {
    headers: { 'Authorization': `Bearer ${tokens?.refreshToken}` }
  }).then((data) => {
    secureLocalStorage.clear();
    return res.status(200).json({ status: "logout successful" });
  }).catch((err) => {
    return res.status(err.response.status).send(err.response?.data)
  });
}
