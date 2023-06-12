import { BASE_URL } from '@/common/config';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  const server_url = BASE_URL;

  const query = req.query;
  const { id } = query;

  try {
    const response = await axios.get(`${server_url}/api/process/access/${id}`);

    if (response.status !== 200)
      return res.status(response.status).json({ result: 'Something went wrong' });

    return res.status(200).json({ ...response.data });
    
  } catch (error: unknown) {
    return res.status(500).json({ result: 'Internal server error' });
  }
}
