import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }
  const server_url = process.env.NEXT_PRIVATE_BASE_URL;
  const { username, password } = req.body;

  const body = {
    username,
    password,
  };
  
  const response = await axios.post(`${server_url}/api/auth/key-auth`, body, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.status !== 200)
    return res.status(response.status).json({ result: 'error logging in' });

  return res.status(200).json({ result: response.data.data });
}
