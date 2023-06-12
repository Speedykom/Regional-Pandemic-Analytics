import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  const server_url = process.env.NEXT_PUBLIC_BASE_URL;

  if (req.method !== 'POST') {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }

  try {
    const response = await axios.get(`${server_url}/api/process/list`);

    console.log(response);

    if (response.status !== 200)
      return res.status(response.status).json({ message: 'Something went wrong' });

    return res.status(200).json({ ...response.data });
  } catch (error: unknown) {
    return res.status(500).json({ result: 'Internal server error' });
  }
}
