import { BASE_URL } from '@/common/config';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  const server_url = BASE_URL;

  try {
    const response = await axios.get(`${server_url}/api/process/list`);

    if (response.status !== 200)
      return res.status(response.status).json({ result: 'Something went wrong' });

    return res.status(200).json({ ...response.data });
    
  } catch (error: unknown) {
    return res.status(500).json({ result: 'Internal server error' });
  }
}
