import { BASE_URL } from '@/common/config';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }

  const { username, password } = req.body;

  const body = JSON.stringify({
    username,
    password,
  });

  try {
    const response = await axios.post(`${BASE_URL}/api/auth/key-auth`, body, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status !== 200)
      return res.status(response.status).json({ result: 'error logging in' });

    return res.status(200).json({ result: response.data });
  } catch (error: unknown) {
    return res.status(500).json({ result: 'Internal server error' });
  }
}
