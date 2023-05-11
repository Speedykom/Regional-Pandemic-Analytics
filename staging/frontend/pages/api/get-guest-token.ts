import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const response = await fetch('http://localhost:3000/api/get-access-token/');

    if (response.status !== 200)
        return res.status(500).json({ error: 'Internal Server Error' });

    const accessToken = await response.json();

    try {
        const body = {
            resources: [
                {
                    type: 'dashboard',
                    id: '7026d58f-2b92-40f2-9160-ed3abe9fead4',
                },
            ],
            rls: [],
            user: {
                username: process.env.SUPERSET_GUEST_USERNAME,
                first_name: process.env.SUPERSET_GUEST_FIRSTNAME,
                last_name: process.env.SUPERSET_GUEST_LASTNAME,
            },
        };
        const response = await fetch(
            `${process.env.SUPERSET_URL}/api/v1/security/guest_token/`,
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken?.accessToken}`,
                },
            }
        );
        const jsonResponse = await response.json();
        return res.status(200).json({ guestToken: jsonResponse?.token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}