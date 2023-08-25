import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const server_url = serverRuntimeConfig.NEXT_PRIVATE_BASE_URL;

  const { username } = req?.query;

  if (!username) {
    return res.status(400).json({ result: 'No username specified' });
  }

  if (req.method != 'GET') {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }

  try {
    const response = await axios.get(`${server_url}/api/data/upload/`, {
      params: {
        username,
      },
    });
    return res.status(200).json({ result: response.data });
  } catch (error: unknown) {
    return res.status(500).json({ result: 'Fail to upload file to server' });
  }
}
