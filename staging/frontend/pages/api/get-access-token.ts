import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const body = {
            username: process.env.SUPERSET_USERNAME,
            password: process.env.SUPERSET_PASSWORD,
            provider: 'db',
            refresh: true,
        };

        const response = await fetch(
            `${process.env.SUPERSET_URL}/api/v1/security/login`,
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const jsonResponse = await response.json();
        return res.status(200).json({ accessToken: jsonResponse?.access_token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}