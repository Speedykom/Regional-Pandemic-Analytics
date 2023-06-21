import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import secureLocalStorage from "react-secure-storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).send(`Method ${req.method} not allowed`);

  secureLocalStorage.clear();
  return res.status(200).json({ status: "logout successful" });
}
